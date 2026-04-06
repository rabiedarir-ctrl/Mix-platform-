// ===========================
// 🔹 Constants Module
// ===========================

// ===========================
// 🔹 إعدادات API
// ===========================
export const API = {
    BASE_URL: "http://localhost:3000/api",
    TIMEOUT: 5000
};

// ===========================
// 🔹 إعدادات اللعبة
// ===========================
export const GAME = {
    MAX_COINS: 50,
    COIN_VALUE: 0.001,
    PLAYER_SPEED: 0.2,
    SPRINT_MULTIPLIER: 2,
    JUMP_FORCE: 0.2
};

// ===========================
// 🔹 إعدادات العالم
// ===========================
export const WORLD = {
    SIZE: 300,
    GRAVITY: -0.01
};

// ===========================
// 🔹 أحداث النظام (Events)
// ===========================
export const EVENTS = {
    COIN_COLLECTED: "coin_collected",
    PLAYER_JOIN: "player_join",
    PLAYER_LEAVE: "player_leave"
};

// ===========================
// 🔹 ألوان
// ===========================
export const COLORS = {
    PRIMARY: 0x00ffcc,
    SECONDARY: 0xff00ff,
    WARNING: 0xff0000,
    SUCCESS: 0x00ff00
};

// ===========================
// 🔹 إعدادات الصوت
// ===========================
export const AUDIO = {
    ENABLED: true,
    VOLUME: 0.8
};
