const WebSocket = require('ws');
const { processDream } = require('./dreams_engine');
const { matrixEvents } = require('../matrix/matrixClient');

// -------------------------------
// 🔹 إعداد WebSocket Server للعالم
const wss = new WebSocket.Server({ port: 8090 });
console.log("World Sync Backend WebSocket running on ws://localhost:8090");

// -------------------------------
// 🔹 تخزين العملاء المتصلين
let clients = [];

// -------------------------------
// 🔹 عند اتصال العميل (Frontend)
wss.on('connection', (ws) => {
    console.log("Frontend connected to World Sync");
    clients.push(ws);

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log("Frontend disconnected from World Sync");
    });

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'dream') {
                // معالجة حلم جديد
                processDream(data.text, data.userId);
            }

            if (data.type === 'game_event') {
                // إرسال حدث لعبة لكل العملاء
                broadcastToClients(data);
            }

            if (data.type === 'chat') {
                // إرسال رسالة محادثة
                broadcastToClients(data);
            }

        } catch (err) {
            console.error("Failed to parse message:", err);
        }
    });
});

// -------------------------------
// 🔹 إرسال بيانات لجميع العملاء
function broadcastToClients(data) {
    const jsonData = JSON.stringify(data, null, 2);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(jsonData);
        }
    });
}

// -------------------------------
// 🔹 استقبال إشعارات Matrix أو AI وربطها بالعالم
matrixEvents.on('dream_alert', (alert) => {
    broadcastToClients({
        type: 'alert',
        userId: alert.userId,
        message: alert.message
    });
});

matrixEvents.on('game_alert', (alert) => {
    broadcastToClients({
        type: 'game_alert',
        payload: alert
    });
});

// -------------------------------
// 🔹 التصدير
module.exports = {
    broadcastToClients,
    wss
};
