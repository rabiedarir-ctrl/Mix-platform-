/**
 * energyService.js
 * ----------------
 * إدارة الطاقة لنظام Mix Platform
 * - قراءة الطاقة
 * - تحديث الطاقة
 * - ربط مع Event Bus
 * - يدعم التطوير المستقبلي مع DB أو WebSocket
 */

const bus = require('../core/eventBus');

// محاكاة تخزين الطاقة مؤقت (يمكن استبداله بقاعدة بيانات لاحقاً)
const energyStore = {};

/**
 * الحصول على طاقة المستخدم
 * @param {string} userId
 * @returns {number} energy
 */
function getEnergy(userId) {
    return energyStore[userId] || 0;
}

/**
 * تحديث طاقة المستخدم
 * @param {string} userId
 * @param {number} value
 * @returns {number} energy المحدثة
 */
function updateEnergy(userId, value) {
    if (!userId || typeof value !== 'number') return null;

    // تحديث الطاقة
    energyStore[userId] = (energyStore[userId] || 0) + value;

    // إرسال حدث إلى Event Bus
    bus.emitEvent(bus.EVENTS.ENERGY_UPDATE, {
        userId,
        energy: energyStore[userId],
        delta: value,
        timestamp: Date.now()
    });

    return energyStore[userId];
}

/**
 * تعيين طاقة المستخدم مباشرة
 * @param {string} userId
 * @param {number} value
 */
function setEnergy(userId, value) {
    if (!userId || typeof value !== 'number') return null;

    energyStore[userId] = value;

    // حدث مباشر للتحديث
    bus.emitEvent(bus.EVENTS.ENERGY_UPDATE, {
        userId,
        energy: value,
        delta: 0,
        timestamp: Date.now()
    });

    return energyStore[userId];
}

/**
 * محاكاة تطور الطاقة مع مرور الوقت
 * - يمكن تشغيله بواسطة Cron أو Timer
 */
function tickEnergy() {
    Object.keys(energyStore).forEach(userId => {
        // كل دقيقة، نزيد الطاقة بمقدار ثابت أو عشوائي
        const delta = Math.floor(Math.random() * 5); // زيادة عشوائية 0-4
        updateEnergy(userId, delta);
    });

    // حدث Tick عام
    bus.emitEvent(bus.EVENTS.ENERGY_TICK, { timestamp: Date.now() });
}

/**
 * إعادة ضبط الطاقة لأي مستخدم (اختياري)
 */
function resetEnergy(userId) {
    energyStore[userId] = 0;
    bus.emitEvent(bus.EVENTS.ENERGY_UPDATE, {
        userId,
        energy: 0,
        delta: 0,
        timestamp: Date.now()
    });
}

module.exports = {
    getEnergy,
    updateEnergy,
    setEnergy,
    tickEnergy,
    resetEnergy
};
