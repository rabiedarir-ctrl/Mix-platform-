// ================================
// 🔹 أنواع الإشعارات
// ================================
const NOTIFICATION_TYPES = Object.freeze({
    INFO: "info",
    WARNING: "warning",
    SUCCESS: "success",
    ERROR: "error"
});

// ================================
// 🔹 أنواع الأحداث التفاعلية في الأحلام
// ================================
const DREAM_EVENT_TYPES = Object.freeze({
    OBJECT_ADDED: "object_added",
    EVENT_TRIGGERED: "event_triggered",
    ENERGY_CHANGE: "energy_change",
    SCENE_UPDATED: "scene_updated"
});

// ================================
// 🔹 حدود الطاقة
// ================================
const ENERGY_LIMITS = Object.freeze({
    MIN: 0,
    MAX: 100
});

// ================================
// 🔹 أسماء العوالم (Metaverse)
const WORLDS = Object.freeze({
    DEFAULT: "defaultWorld",
    DREAM: "dreamWorld",
    CITY: "cityWorld"
});

// ================================
// 🔹 قيم ثابتة للألعاب
const GAME_CONSTANTS = Object.freeze({
    BTC_GAME_INTERVAL_MS: 1000,   // تحديث اللعبة كل ثانية
    COIN_SPAWN_CHANCE: 0.05,      // احتمال ظهور عملة
    MAX_SCORE: 1000
});

// ================================
// 🔹 قيم التخزين وملفات النظام
const STORAGE_PATHS = Object.freeze({
    USERS: "storage/users.json",
    SOCIAL: "storage/social.json",
    MESSAGES: "storage/messages.json",
    WALLETS: "storage/wallets.json",
    DREAMS: "storage/dreams.json",
    DREAM_WORLDS: "storage/dream_worlds.json"
});

// ================================
// 🔹 تصدير القيم
module.exports = {
    NOTIFICATION_TYPES,
    DREAM_EVENT_TYPES,
    ENERGY_LIMITS,
    WORLDS,
    GAME_CONSTANTS,
    STORAGE_PATHS
};
