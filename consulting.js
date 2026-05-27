document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.querySelector('.send-btn');
    const chatInput = document.querySelector('.input-wrapper input[type="text"]');
    const chatBody = document.querySelector('.consulting-chat-body');
    window.MXCartBadge?.sync();

    function createMessage({ type, text, time, avatarSrc, avatarAlt }) {
        const message = document.createElement('div');
        message.className = `chat-message ${type}`;

        if (type === 'received') {
            const avatar = document.createElement('div');
            avatar.className = 'chat-avatar';
            const img = document.createElement('img');
            img.src = avatarSrc;
            img.alt = avatarAlt;
            avatar.appendChild(img);
            message.appendChild(avatar);
        }

        const content = document.createElement('div');
        content.className = 'message-content';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        bubble.appendChild(paragraph);

        const timeStamp = document.createElement('span');
        timeStamp.className = 'message-time';
        timeStamp.textContent = time;

        content.appendChild(bubble);
        content.appendChild(timeStamp);
        message.appendChild(content);

        return message;
    }

    function sendMessage() {
        if (!chatInput || !chatBody) return;
        const text = chatInput.value.trim();
        if (text) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const userMessage = createMessage({ type: 'sent', text, time });
            chatBody.appendChild(userMessage);
            chatInput.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;

            setTimeout(() => {
                const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const expertMessage = createMessage({
                    type: 'received',
                    text: 'Cảm ơn bạn đã phản hồi. Để mình kiểm tra lại và tư vấn thêm nhé!',
                    time: replyTime,
                    avatarSrc: 'assets/figma/dc90ed69-7482-46d2-8a56-b653f2e31358.jpg',
                    avatarAlt: 'Lan Anh'
                });
                chatBody.appendChild(expertMessage);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1500);
        }
    }

    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }

});
