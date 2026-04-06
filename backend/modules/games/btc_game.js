const WebSocket = require('ws');
const { broadcastToClients } = require('../metaverse/world_sync');
const { processDream } = require('../metaverse/dreams_engine');

let gameState = {
    players: {},  // userId => {balance, position}
    coins: []
};

let gameInterval;

// -------------------------------
// 🔹 بدء اللعبة للاعب معين
function startGame(userId) {
    if (!gameState.players[userId]) {
        gameState.players[userId] = { balance: 100, position: { x:0, y:0, z:0 } };
    }

    if (gameInterval) clearInterval(gameInterval);

    gameInterval = setInterval(() => {
        updateCoins();
        broadcastGameState();
    }, 1000);
}

// -------------------------------
// 🔹 توليد عملات عشوائية
function updateCoins() {
    if (Math.random() < 0.2) {
        const coin = {
            id: `coin_${Date.now()}`,
            value: Math.floor(Math.random()*10)+1,
            position: {
                x: Math.random()*50-25,
                y: 1,
                z: Math.random()*50-25
            }
        };
        gameState.coins.push(coin);
        broadcastToClients({ type:'new_coin', coin });
    }
}

// -------------------------------
// 🔹 تحديث حالة اللاعب بعد التقاط عملة
function collectCoin(userId, coinId) {
    const coinIndex = gameState.coins.findIndex(c => c.id === coinId);
    if (coinIndex === -1) return;

    const coin = gameState.coins.splice(coinIndex,1)[0];
    gameState.players[userId].balance += coin.value;

    // إشعار اللاعب
    broadcastToClients({
        type:'coin_collected',
        userId,
        coin,
        balance: gameState.players[userId].balance
    });

    // ربط مع Dream Engine عند قيمة معينة
    if (gameState.players[userId].balance >= 500) {
        processDream(`لقد وصلت رصيد 500 BTC في اللعبة!`, userId);
    }
}

// -------------------------------
// 🔹 بث حالة اللعبة لكل العملاء
function broadcastGameState() {
    broadcastToClients({
        type:'game_state',
        players: gameState.players,
        coins: gameState.coins
    });
}

// -------------------------------
// 🔹 إنهاء اللعبة
function stopGame() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = null;
}

// -------------------------------
// 🔹 التصدير
module.exports = {
    startGame,
    stopGame,
    collectCoin
};
