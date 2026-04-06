// ===========================
// 🔹 BTC Game Wallet Integration
// ===========================
import BtcGame from "./btc_game.js";

// ===========================
// 🔹 إعداد اللعبة
// ===========================
const game = new BtcGame({
    containerId: "game-container"
});

// ===========================
// 🔹 Dashboard و Wallet
// ===========================
const scoreElement = document.getElementById("score");
let score = 0;

// تمثيل Wallet مبسط
let walletBalance = 0;
const walletElement = document.getElementById("wallet-balance");

// ===========================
// 🔹 إشعارات
// ===========================
const notificationsContainer = document.getElementById("notifications");

function showNotification(message, duration = 2000) {
    const notif = document.createElement("div");
    notif.className = "notification";
    notif.innerText = message;
    notificationsContainer.appendChild(notif);

    setTimeout(() => {
        notificationsContainer.removeChild(notif);
    }, duration);
}

// ===========================
// 🔹 محاكاة جمع العملات وربطها بالـ Wallet
// ===========================
function collectCoins() {
    const playerPosition = { x: 0, y: 0, z: 0 };

    game.coins.forEach((coin, index) => {
        const dx = coin.position.x - playerPosition.x;
        const dz = coin.position.z - playerPosition.z;
        const distance = Math.sqrt(dx*dx + dz*dz);

        if (distance < 1) {
            // إزالة العملة من المشهد
            game.scene.remove(coin);
            game.coins.splice(index, 1);

            // تحديث نقاط اللعبة
            score += 1;
            scoreElement.innerText = `Score: ${score}`;

            // تحديث Wallet
            walletBalance += 0.001; // كل عملة = 0.001 BTC (مثال)
            walletElement.innerText = `Wallet: ${walletBalance.toFixed(3)} BTC`;

            // إشعار ديناميكي
            showNotification(`تم جمع عملة بيتكوين! +0.001 BTC`);
            
            // 🔔 إطلاق حدث Metaverse
            triggerMetaverseEvent("coinCollected", { score, walletBalance });
        }
    });
}

// ===========================
// 🔹 محاكاة أحداث Metaverse
// ===========================
function triggerMetaverseEvent(eventType, data) {
    // مثال: يمكن الربط لاحقًا مع WebSocket أو نظام Metaverse مركزي
    console.log("🌐 Metaverse Event:", eventType, data);
}

// ===========================
// 🔹 إضافة الوظائف للـ Loop
// ===========================
game.world.addUpdateFunction(() => {
    collectCoins();
});
