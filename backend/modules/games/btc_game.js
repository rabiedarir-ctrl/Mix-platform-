const WalletManager = require('../wallet/wallet_manager').WalletManager;
const walletManager = new WalletManager();

let gameInterval;
let coins = [];
let player = { x: 200, y: 400, width: 20, height: 20 };

// -------------------------------
// 🔹 توليد عملة بيتكوين عشوائية
function spawnCoin() {
    const coin = {
        x: Math.floor(Math.random() * 380),
        y: 0,
        size: 10,
        collected: false
    };
    coins.push(coin);
}

// -------------------------------
// 🔹 تحديث موقع العملات وحالة اللاعب
function updateCoins() {
    coins.forEach(coin => {
        coin.y += 2; // سرعة سقوط العملة
        if (!coin.collected && detectCollision(player, coin)) {
            coin.collected = true;
            walletManager.update_balance(player.id, 0.01, "Collected BTC coin");
            console.log("Coin collected! +0.01 BTC");
        }
    });
    // إزالة العملات المجمعة أو التي خرجت من الشاشة
    coins = coins.filter(coin => coin.y < 400 && !coin.collected);
}

// -------------------------------
// 🔹 كشف التصادم
function detectCollision(player, coin) {
    return (
        player.x < coin.x + coin.size &&
        player.x + player.width > coin.x &&
        player.y < coin.y + coin.size &&
        player.y + player.height > coin.y
    );
}

// -------------------------------
// 🔹 رسم اللعبة (placeholder، يمكن ربطه بالواجهة frontend)
function draw() {
    // هنا يمكن إضافة الكود لواجهة Three.js أو Canvas
    updateCoins();
}

// -------------------------------
// 🔹 تشغيل اللعبة
function startGame(playerId) {
    player.id = playerId;
    coins = [];
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        draw();
        if (Math.random() < 0.05) spawnCoin();
    }, 1000 / 60); // 60 FPS
    console.log("BTC Game started for player ID:", playerId);
}

// -------------------------------
// 🔹 إيقاف اللعبة
function stopGame() {
    if (gameInterval) clearInterval(gameInterval);
    console.log("BTC Game stopped");
}

// -------------------------------
// 🔹 التصدير
module.exports = { startGame, stopGame };
