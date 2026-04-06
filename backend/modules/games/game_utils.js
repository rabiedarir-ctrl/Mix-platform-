const GameUtils = {

    // -------------------------------
    // 🔹 توليد عدد صحيح عشوائي بين min و max
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // -------------------------------
    // 🔹 كشف التصادم بين كائنين مستطيلين
    detectCollision: function(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    },

    // -------------------------------
    // 🔹 حساب المسافة بين نقطتين (x1, y1) و (x2, y2)
    distance: function(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    // -------------------------------
    // 🔹 قياس سرعة الحركة حسب الزمن والإطار
    computeVelocity: function(distance, timeSeconds) {
        return distance / timeSeconds;
    }

};

// -------------------------------
// 🔹 التصدير
module.exports = GameUtils;
