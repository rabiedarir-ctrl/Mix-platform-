// ===========================
// 🔹 إعداد WebSocket
// ===========================
const WS_URL = "ws://localhost:3000"; // غيّره في الإنتاج
let socket = null;

// ===========================
// 🔹 الحالة العامة
// ===========================
let isConnected = false;
let listeners = {};

// ===========================
// 🔹 الاتصال بالخادم
// ===========================
export function connectMatrix(token) {
    if (socket && isConnected) return;

    socket = new WebSocket(`${WS_URL}?token=${token}`);

    socket.onopen = () => {
        console.log("🟢 Matrix Connected");
        isConnected = true;
        emitLocal("connected");
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            handleMessage(data);
        } catch (err) {
            console.error("Message Parse Error:", err);
        }
    };

    socket.onclose = () => {
        console.warn("🔴 Matrix Disconnected");
        isConnected = false;

        // إعادة الاتصال التلقائي
        setTimeout(() => connectMatrix(token), 3000);
    };

    socket.onerror = (err) => {
        console.error("WebSocket Error:", err);
    };
}

// ===========================
// 🔹 إرسال حدث
// ===========================
export function sendEvent(type, payload = {}) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("Socket not ready");
        return;
    }

    socket.send(JSON.stringify({
        type,
        payload
    }));
}

// ===========================
// 🔹 استقبال الأحداث
// ===========================
function handleMessage(data) {
    const { type, payload } = data;

    switch (type) {

        // 🔹 رسالة دردشة
        case "chat_message":
            emitLocal("chat", payload);
            break;

        // 🔹 مستخدم دخل
        case "user_joined":
            emitLocal("user_joined", payload);
            break;

        // 🔹 مستخدم خرج
        case "user_left":
            emitLocal("user_left", payload);
            break;

        // 🔹 تحديث موقع في Metaverse
        case "player_move":
            emitLocal("player_move", payload);
            break;

        // 🔹 حدث حلم
        case "dream_event":
            emitLocal("dream_event", payload);
            break;

        // 🔹 إشعار عام
        case "notification":
            emitLocal("notification", payload);
            break;

        default:
            console.warn("Unknown event:", type);
    }
}

// ===========================
// 🔹 نظام Events داخلي
// ===========================
export function on(event, callback) {
    if (!listeners[event]) {
        listeners[event] = [];
    }
    listeners[event].push(callback);
}

function emitLocal(event, data) {
    if (!listeners[event]) return;

    listeners[event].forEach(cb => {
        try {
            cb(data);
        } catch (err) {
            console.error("Listener error:", err);
        }
    });
}

// ===========================
// 🔹 قطع الاتصال
// ===========================
export function disconnectMatrix() {
    if (socket) {
        socket.close();
        socket = null;
        isConnected = false;
    }
          }
