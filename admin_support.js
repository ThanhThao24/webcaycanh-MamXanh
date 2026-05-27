document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'mamxanh_support_tickets';

  function loadTickets() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  }

  function saveTickets(tickets) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }

  function updateStats(tickets) {
    const statValues = document.querySelectorAll('.support-stats .stat-value');
    if (statValues[0]) statValues[0].textContent = tickets.length.toLocaleString('vi-VN');
    if (statValues[1]) statValues[1].textContent = tickets.filter(t => t.status === 'pending').length;
    if (statValues[2]) statValues[2].textContent = tickets.filter(t => t.status === 'consulting').length;
  }

  let tickets = loadTickets();
  updateStats(tickets);

  // ── Inbox item click → active + update chat header ──
  const inboxItems = document.querySelectorAll('.inbox-item');
  inboxItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      inboxItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const name = item.querySelector('.customer-name')?.textContent;
      if (name) {
        const chatNameEl = document.querySelector('.chat-user-info h4');
        if (chatNameEl) chatNameEl.textContent = name;
      }
    });
  });

  // ── Inject chat input at bottom of chat panel ──
  const chatPanel = document.querySelector('.chat-panel');
  if (chatPanel && !chatPanel.querySelector('.chat-input-area')) {
    const inputArea = document.createElement('div');
    inputArea.className = 'chat-input-area';
    inputArea.style.cssText = [
      'display:flex',
      'gap:8px',
      'padding:16px',
      'border-top:1px solid #f4f4ef',
      'background:#fff',
      'flex-shrink:0'
    ].join(';');
    inputArea.innerHTML = `
      <input type="text" placeholder="Nhập phản hồi..." class="chat-input-field"
        style="flex:1;border:1px solid #e7e5e4;border-radius:9999px;padding:10px 16px;font-family:Inter,sans-serif;font-size:14px;color:#1a1c19;outline:none;">
      <button class="chat-send-btn"
        style="background:#154212;color:#fff;border:none;border-radius:9999px;padding:10px 20px;font-family:Inter,sans-serif;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;">
        Gửi
      </button>`;
    chatPanel.appendChild(inputArea);

    const field = inputArea.querySelector('.chat-input-field');
    const sendBtn = inputArea.querySelector('.chat-send-btn');

    function sendMessage() {
      const text = field.value.trim();
      if (!text) return;
      const chatArea = document.querySelector('.chat-area');
      if (chatArea) {
        const now = new Date();
        const h = now.getHours();
        const m = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${h}:${m} ${h < 12 ? 'AM' : 'PM'}`;
        const msgEl = document.createElement('div');
        msgEl.className = 'chat-message message-sent';
        msgEl.innerHTML = `
          <div class="message-bubble">
            <p>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            <span class="msg-time">${timeStr}</span>
          </div>
          <div class="admin-avatar">MX</div>`;
        chatArea.appendChild(msgEl);
        chatArea.scrollTop = chatArea.scrollHeight;
      }
      field.value = '';
    }

    sendBtn.addEventListener('click', sendMessage);
    field.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
  }

  // ── New ticket button ──
  document.querySelector('.btn-new-ticket')?.addEventListener('click', () => {
    const customer = prompt('Tên khách hàng:');
    if (!customer?.trim()) return;
    const subject = prompt('Chủ đề hỗ trợ:');
    if (!subject?.trim()) return;
    tickets.unshift({
      id: 'TK-' + Date.now(),
      customer: customer.trim(),
      subject: subject.trim(),
      status: 'pending',
      date: new Date().toISOString()
    });
    saveTickets(tickets);
    updateStats(tickets);
    toast('Đã tạo ticket: ' + customer.trim());
  });

  // ── Purchase history → orders page ──
  document.querySelector('.btn-purchase-history')?.addEventListener('click', () => {
    window.location.href = 'admin_orders.html';
  });

  // ── Header search filters inbox ──
  const searchInput = document.querySelector('.admin-search input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      document.querySelectorAll('.inbox-item').forEach(item => {
        const name = item.querySelector('.customer-name')?.textContent.toLowerCase() || '';
        const preview = item.querySelector('.message-preview')?.textContent.toLowerCase() || '';
        item.style.display = (!q || name.includes(q) || preview.includes(q)) ? '' : 'none';
      });
    });
  }

  function toast(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;top:20px;right:20px;background:#154212;color:#fff;padding:10px 14px;border-radius:8px;z-index:9999;font-family:Inter,sans-serif;font-size:14px;box-shadow:0 8px 20px rgba(0,0,0,.2)';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
});
