const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: { // نوع المعاملة: إيداع، سحب، مكافأة، شراء في اللعبة
        type: String,
        enum: ['deposit', 'withdraw', 'reward', 'game_purchase'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: { // دعم العملات المختلفة، مثلاً BTC، MIX Tokens
        type: String,
        default: 'MIX'
    },
    status: { // حالة المعاملة
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    linkedGameEvent: { // ربط المعاملة بأحداث اللعبة أو الأحلام
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// -------------------------------
// 🔹 تحديث وقت التعديل تلقائيًا
TransactionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// -------------------------------
// 🔹 تحديث حالة المعاملة
TransactionSchema.methods.updateStatus = function(newStatus) {
    this.status = newStatus;
    return this.status;
};

// -------------------------------
// 🔹 ربط حدث اللعبة أو حلم بالمعاملة
TransactionSchema.methods.linkGameEvent = function(eventData) {
    this.linkedGameEvent = eventData;
    return this.linkedGameEvent;
};

// -------------------------------
// 🔹 التصدير
const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
