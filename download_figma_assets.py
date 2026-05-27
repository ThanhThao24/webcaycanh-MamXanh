#!/usr/bin/env python3
"""Download Figma MCP assets referenced in source files and optionally rewrite URLs.

Usage examples:
  python3 scripts/download_figma_assets.py
  python3 scripts/download_figma_assets.py --rewrite
  python3 scripts/download_figma_assets.py --include "post.html,checkout.html,profile.html" --rewrite
"""

from __future__ import annotations

import argparse
import re
from os.path import relpath
from pathlib import Path
from typing import Dict, Iterable, List, Set, Tuple

import requests

URL_RE = re.compile(r"https://www\.figma\.com/api/mcp/asset/(?P<asset_id>[0-9a-f-]+)")

CONTENT_TYPE_EXT = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/gif": "gif",
}

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    ),
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Referer": "https://www.figma.com/",
}


DEFAULT_SCAN_GLOBS = ("*.html", "*.js", "*.css")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".", help="Project root")
    parser.add_argument("--output-dir", default="assets/figma", help="Output folder for downloaded assets")
    parser.add_argument(
        "--include",
        default="",
        help=(
            "Comma-separated files (relative to root). "
            "If empty, recursively scans *.html, *.js, *.css."
        ),
    )
    parser.add_argument("--rewrite", action="store_true", help="Rewrite successfully downloaded URLs in HTML files")
    parser.add_argument("--force", action="store_true", help="Redownload and overwrite existing local files")
    parser.add_argument("--timeout", type=int, default=30, help="HTTP timeout in seconds")
    return parser.parse_args()


def detect_ext(content_type: str, payload: bytes) -> str:
    if content_type:
        pure = content_type.split(";", 1)[0].strip().lower()
        if pure in CONTENT_TYPE_EXT:
            return CONTENT_TYPE_EXT[pure]

    sig = payload[:64].lstrip().lower()
    if sig.startswith(b"<svg") or b"<svg" in sig:
        return "svg"
    if payload.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if payload.startswith(b"\xff\xd8"):
        return "jpg"
    if payload.startswith(b"RIFF") and payload[8:12] == b"WEBP":
        return "webp"
    if payload.startswith(b"GIF87a") or payload.startswith(b"GIF89a"):
        return "gif"
    return "bin"


def collect_source_files(root: Path, include: str) -> List[Path]:
    if include.strip():
        files: List[Path] = []
        for item in include.split(","):
            path = root / item.strip()
            if path.exists() and path.is_file():
                files.append(path)
        return files

    collected: Set[Path] = set()
    for pattern in DEFAULT_SCAN_GLOBS:
        for path in root.rglob(pattern):
            if not path.is_file():
                continue
            if "assets/figma" in path.as_posix() or "assets/fallback" in path.as_posix():
                continue
            collected.add(path)
    return sorted(collected)


def collect_asset_urls(source_files: Iterable[Path]) -> Tuple[Dict[str, str], Dict[Path, Set[str]]]:
    by_id: Dict[str, str] = {}
    by_file: Dict[Path, Set[str]] = {}

    for source in source_files:
        text = source.read_text(encoding="utf-8")
        ids: Set[str] = set()
        for match in URL_RE.finditer(text):
            asset_id = match.group("asset_id")
            by_id[asset_id] = match.group(0)
            ids.add(asset_id)
        by_file[source] = ids

    return by_id, by_file


def existing_asset(output_dir: Path, asset_id: str) -> Path | None:
    matches = sorted(output_dir.glob(f"{asset_id}.*"))
    return matches[0] if matches else None


def download_assets(
    output_dir: Path,
    id_to_url: Dict[str, str],
    timeout: int,
    force: bool,
) -> Tuple[Dict[str, Path], Dict[str, str], Dict[str, str]]:
    output_dir.mkdir(parents=True, exist_ok=True)

    downloaded: Dict[str, Path] = {}
    skipped_existing: Dict[str, str] = {}
    failed: Dict[str, str] = {}

    with requests.Session() as session:
        session.headers.update(DEFAULT_HEADERS)

        for asset_id, url in sorted(id_to_url.items()):
            found = existing_asset(output_dir, asset_id)
            if found is not None and not force:
                downloaded[asset_id] = found
                skipped_existing[asset_id] = "exists"
                continue

            try:
                response = session.get(url, timeout=timeout, allow_redirects=True)
            except Exception as exc:  # noqa: BLE001
                failed[asset_id] = f"request error: {exc}"
                continue

            if response.status_code != 200:
                failed[asset_id] = f"http {response.status_code}"
                continue

            payload = response.content
            if not payload:
                failed[asset_id] = "empty body"
                continue

            ext = detect_ext(response.headers.get("content-type", ""), payload)
            out = output_dir / f"{asset_id}.{ext}"
            out.write_bytes(payload)
            downloaded[asset_id] = out

    return downloaded, skipped_existing, failed


def rewrite_source_files(
    source_files: Iterable[Path],
    root: Path,
    id_to_local: Dict[str, Path],
) -> int:
    updated_count = 0

    for source in source_files:
        text = source.read_text(encoding="utf-8")
        new_text = text

        for match in URL_RE.finditer(text):
            asset_id = match.group("asset_id")
            local = id_to_local.get(asset_id)
            if local is None:
                continue
            rel = Path(relpath(local, start=source.parent)).as_posix()
            new_text = new_text.replace(match.group(0), rel)

        if new_text != text:
            source.write_text(new_text, encoding="utf-8")
            updated_count += 1

    return updated_count


def main() -> int:
    args = parse_args()
    root = Path(args.root).resolve()
    output_dir = (root / args.output_dir).resolve()

    source_files = collect_source_files(root, args.include)
    if not source_files:
        print("No source files found.")
        return 1

    id_to_url, by_file = collect_asset_urls(source_files)

    print(f"Scanned source files: {len(source_files)}")
    print(f"Unique Figma assets: {len(id_to_url)}")

    downloaded, skipped_existing, failed = download_assets(
        output_dir=output_dir,
        id_to_url=id_to_url,
        timeout=args.timeout,
        force=args.force,
    )

    print(f"Downloaded/available locally: {len(downloaded)}")
    print(f"Skipped existing: {len(skipped_existing)}")
    print(f"Failed: {len(failed)}")

    if failed:
        print("\nFailed asset IDs:")
        for asset_id, reason in sorted(failed.items()):
            print(f"  - {asset_id}: {reason}")

    if args.rewrite:
        touched = rewrite_source_files(
            source_files=source_files,
            root=root,
            id_to_local=downloaded,
        )
        print(f"\nRewritten source files: {touched}")

        unresolved_per_file: Dict[str, int] = {}
        for source in source_files:
            text = source.read_text(encoding="utf-8")
            unresolved_per_file[source.as_posix().replace(root.as_posix() + "/", "")] = len(URL_RE.findall(text))

        print("Unresolved Figma URLs by file:")
        for file_name, count in sorted(unresolved_per_file.items()):
            if count > 0:
                print(f"  - {file_name}: {count}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
