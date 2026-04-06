const { client, sendMessage, sendAlert, matrixEvents } = require('./matrixClient');
const GameUtils = require('../games/game_utils');
const AIAlerts = require('../ai/ai_alerts').AIAlerts;

const aiAlerts = new AIAlerts();

// -------------------------------
// 🔹 إنشاء غرفة جديدة
async function createRoom(name, inviteUsers = []) {
    try {
        const roomId = await client.createRoom({
            visibility: "private",
            name: name,
            invite: inviteUsers
        });
        console.log(`Room created: ${name} (ID: ${roomId})`);
        return roomId;
    } catch (err) {
        console.error("Failed to create room:", err);
        return null;
    }
}

// -------------------------------
// 🔹 دعوة مستخدم لغرفة
async function inviteUser(roomId, userId) {
    try {
        await client.inviteUser(roomId, userId);
        console.log(`User ${userId} invited to room ${roomId}`);
    } catch (err) {
        console.error("Failed to invite user:", err);
    }
}

// -------------------------------
// 🔹 إرسال حدث تفاعلي للغرفة
function sendInteractiveEvent(roomId, eventData) {
    // مثال: ربط الحدث بالعالم ثلاثي الأبعاد
    matrixEvents.emit("3d_event", { roomId, ...eventData });
    console.log(`Interactive event sent to room ${roomId}:`, eventData);
}

// -------------------------------
// 🔹 إرسال إشعارات AI للأعضاء
async function sendRoomAlert(roomId, message) {
    try {
        const members = await client.getJoinedRoomMembers(roomId);
        members.forEach(memberId => {
            sendAlert(memberId, message);
            sendMessage(roomId, `تنبيه من AI: ${message}`);
        });
    } catch (err) {
        console.error("Failed to send room alert:", err);
    }
}

// -------------------------------
// 🔹 بدء لعبة جماعية داخل الغرفة
function startRoomGame(roomId, playerIds = []) {
    playerIds.forEach(playerId => {
        matrixEvents.emit("game_start", { roomId, playerId });
        sendAlert(playerId, "تم بدء لعبة BTC جماعية!");
        sendMessage(roomId, `اللاعب ${playerId} بدأ لعبة BTC 🎮`);
    });
}

// -------------------------------
// 🔹 إيقاف اللعبة داخل الغرفة
function stopRoomGame(roomId, playerIds = []) {
    playerIds.forEach(playerId => {
        matrixEvents.emit("game_stop", { roomId, playerId });
        sendAlert(playerId, "تم إيقاف لعبة BTC جماعية!");
        sendMessage(roomId, `اللاعب ${playerId} أوقف لعبة BTC 🛑`);
    });
}

// -------------------------------
// 🔹 التصدير
module.exports = {
    createRoom,
    inviteUser,
    sendInteractiveEvent,
    sendRoomAlert,
    startRoomGame,
    stopRoomGame
};
