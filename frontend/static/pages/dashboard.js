// ===========================
// 🔹 Dashboard Module
// ===========================

import { fetchData } from "../api.js";
import VoiceChat from "../voice_chat.js";
import EventsSystem from "../modules/metaverse/events_system.js";
import QuestsSystem from "../modules/metaverse/quests_system.js";

class Dashboard {
    constructor(player, wallet, worldEngine) {
        this.player = player;
        this.wallet = wallet;
        this.worldEngine = worldEngine;

        this.events = new EventsSystem(player, worldEngine);
        this.quests = new QuestsSystem(player, wallet);

        this.initUI();
        this.initUpdateLoop();
    }

    // ===========================
    // 🔹 إعداد واجهة المستخدم
    // ===========================
    initUI() {
        this.energyEl = document.getElementById("dashboard-energy");
        this.coinsEl = document.getElementById("dashboard-coins");
        this.questsEl = document.getElementById("dashboard-quests");
        this.eventsEl = document.getElementById("dashboard-events");
        this.notificationsEl = document.getElementById("dashboard-notifications");

        console.log("✅ Dashboard UI initialized");
    }

    // ===========================
    // 🔹 تحديث القيم بشكل دوري
    // ===========================
    initUpdateLoop() {
        setInterval(() => {
            this.updateEnergy();
            this.updateCoins();
            this.updateQuests();
            this.updateEvents();
            this.updateNotifications();
        }, 1000);
    }

    updateEnergy() {
        if (this.energyEl) {
            this.energyEl.textContent = `⚡ الطاقة: ${this.player.energy}`;
        }
    }

    updateCoins() {
        if (this.coinsEl) {
            this.coinsEl.textContent = `💰 العملات: ${this.wallet.coins}`;
        }
    }

    updateQuests() {
        if (this.questsEl) {
            const activeQuests = this.quests.listQuests()
                .filter(q => !q.completed)
                .map(q => q.description)
                .join(", ");
            this.questsEl.textContent = `🎯 المهام النشطة: ${activeQuests || "لا توجد مهام"}`;
        }
    }

    updateEvents() {
        if (this.eventsEl) {
            const activeEvents = this.events.listEvents()
                .filter(e => !e.executed)
                .map(e => e.description)
                .join(", ");
            this.eventsEl.textContent = `🌟 الأحداث النشطة: ${activeEvents || "لا توجد أحداث"}`;
        }
    }

    updateNotifications() {
        if (this.notificationsEl) {
            // افترض وجود API للإشعارات
            fetchData("../notifications").then(data => {
                if (!data || data.length === 0) {
                    this.notificationsEl.textContent = "📬 لا توجد إشعارات";
                } else {
                    this.notificationsEl.textContent = data.map(n => `🔔 ${n.message}`).join(" | ");
                }
            });
        }
    }
}

// ===========================
// 🔹 تهيئة Dashboard عند التحميل
// ===========================
document.addEventListener("DOMContentLoaded", async () => {
    // مثال للاعب ومحفظة
    const player = { energy: 100, position: { x: 0, y: 0, z: 0 } };
    const wallet = { coins: 500, addTransaction(tx) { this.coins += tx.coins || 0; } };
    const worldEngine = { onUpdate: (cb) => setInterval(cb, 50) };

    window.dashboard = new Dashboard(player, wallet, worldEngine);
});
