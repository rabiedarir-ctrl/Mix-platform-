// ===========================
// 🔹 Helpers Module
// ===========================

export const Helpers = {

    // ===========================
    // 🔹 رقم عشوائي ضمن مجال
    // ===========================
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // ===========================
    // 🔹 اختيار عنصر عشوائي من Array
    // ===========================
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // ===========================
    // 🔹 حساب المسافة بين نقطتين (2D)
    // ===========================
    distance2D(a, b) {
        const dx = a.x - b.x;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dz * dz);
    },

    // ===========================
    // 🔹 Clamp (تقييد قيمة)
    // ===========================
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    // ===========================
    // 🔹 تأخير (Delay)
    // ===========================
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // ===========================
    // 🔹 إنشاء ID فريد
    // ===========================
    generateId(prefix = "mix") {
        return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    },

    // ===========================
    // 🔹 تنسيق رقم (Wallet)
    // ===========================
    formatNumber(num, decimals = 3) {
        return Number(num).toFixed(decimals);
    },

    // ===========================
    // 🔹 تسجيل Log منظم
    // ===========================
    log(title, data) {
        console.log(`📦 [${title}]`, data);
    }
};
