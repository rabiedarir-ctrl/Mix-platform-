// backend/models/gameModel.advanced.js
const mongoose = require('mongoose');
const eventBus = require('../core/eventBus');
const EnergyModel = require('./energyModel');

const gameSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameType: {
        type: String,
        required: true // مثال: "BTC Game", "Puzzle", "DreamQuest"
    },
    score: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    status: {
        type: String,
        enum: ['active', 'completed', 'paused', 'failed'],
        default: 'active'
    },
    lastPlayed: { type: Date, default: Date.now },
    reward: {
        energy: { type: Number, default: 0 },
        items: [{ type: String }]
    },
    history: [
        {
            timestamp: { type: Date, default: Date.now },
            scoreDelta: Number,
            levelDelta: Number,
            energyDelta: Number,
            result: String
        }
    ]
}, { timestamps: true });

/**
 * تحديث نتيجة اللعبة بشكل متقدم
 * يشمل خصم الطاقة، نشر أحداث، تسجيل المكافآت
 */
gameSchema.methods.updateGameAdvanced = async function({
    scoreDelta = 0,
    levelDelta = 0,
    energyCost = 0,
    result = 'active',
    rewardItems = []
}) {
    this.score += scoreDelta;
    this.level += levelDelta;
    this.status = result === 'win' || result === 'lose' ? 'completed' : result;
    this.lastPlayed = new Date();

    // خصم الطاقة من EnergyModel تلقائيًا
    let energyDelta = 0;
    if (energyCost > 0) {
        const energyRecord = await EnergyModel.findOne({ userId: this.userId });
        if (energyRecord) {
            energyDelta = -energyCost;
            await energyRecord.updateEnergy(energyDelta, `Game: ${this.gameType}`);
        }
    }

    // إضافة المكافآت
    if (rewardItems.length > 0) {
        this.reward.items.push(...rewardItems);
    }

    // تحديث سجل اللعبة
    this.history.push({
        timestamp: new Date(),
        scoreDelta,
        levelDelta,
        energyDelta,
        result
    });

    await this.save();

    // نشر أحداث على EventBus لكل تحديث
    eventBus.publish('game.updated', {
        userId: this.userId,
        gameType: this.gameType,
        score: this.score,
        level: this.level,
        status: this.status,
        rewardEnergy: energyDelta,
        rewardItems
    });

    // إذا كانت اللعبة مكتملة، نشر حدث مكافأة
    if (this.status === 'completed' && (energyDelta !== 0 || rewardItems.length > 0)) {
        eventBus.publish('game.reward', {
            userId: this.userId,
            energyDelta,
            rewardItems,
            gameType: this.gameType
        });
    }

    return this;
};

module.exports = mongoose.model('GameAdvanced', gameSchema);
