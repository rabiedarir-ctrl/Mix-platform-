import { SocialAPI } from "./api.js";

// ===========================
// 🔹 عناصر DOM الأساسية
// ===========================
const messagesContainer = document.getElementById("messagesContainer");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

// ===========================
// 🔹 جلب وعرض الرسائل
// ===========================
async function loadMessages() {
    const messages = await SocialAPI.getMessages();
    if (!messages) return;

    messagesContainer.innerHTML = "";
    messages.forEach(msg => {
        const msgEl = document.createElement("div");
        msgEl.classList.add("message");
        msgEl.innerHTML = `
            <strong>${msg.senderName}</strong>: ${msg.content}
            <span class="timestamp">${new Date(msg.createdAt).toLocaleTimeString()}</span>
        `;
        messagesContainer.appendChild(msgEl);
    });

    // تمرير الدردشة لأسفل تلقائيًا
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===========================
// 🔹 إرسال رسالة جديدة
// ===========================
if (messageForm) {
    messageForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const content = messageInput.value.trim();
        if (!content) return;

        const newMsg = await SocialAPI.sendMessage({ content });
        if (newMsg && !newMsg.error) {
            messageInput.value = "";
            loadMessages();
        } else {
            alert("فشل إرسال الرسالة");
        }
    });
}

// ===========================
// 🔹 تحديث تلقائي للرسائل كل 3 ثواني
// ===========================
setInterval(loadMessages, 3000);

// ===========================
// 🔹 التحميل الأولي للرسائل
// ===========================
document.addEventListener("DOMContentLoaded", loadMessages);
