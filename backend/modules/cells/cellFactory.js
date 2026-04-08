// backend/modules/cells/cellFactory.js

const cellManager = require('./cellManager');
const eventBus = require('../../core/eventBus');

class CellFactory {

    constructor() {
        this.registry = new Map(); // تخزين أنواع الخلايا المسجلة
        this.init();
    }

    init() {
        // تسجيل الأنواع الأساسية
        this.registerDefaultTypes();

        // مثال: إنشاء خلية تلقائي عند تسجيل مستخدم
        eventBus.subscribe('user.created', (data) => {
            this.createUserCell(data.userId);
        });
    }

    // تسجيل نوع خلية جديد
    registerType(type, config = {}) {
        this.registry.set(type, config);
    }

    // تسجيل الأنواع الافتراضية
    registerDefaultTypes() {
        this.registerType('userCell', {
            baseEnergy: 100,
            autoCreate: true
        });

        this.registerType('gameCell', {
            baseEnergy: 50,
            autoCreate: false
        });

        this.registerType('dreamCell', {
            baseEnergy: 30,
            autoCreate: false
        });
    }

    // إنشاء خلية عامة
    createCell({ type = 'generic', ownerId = null, energy = null }) {
        const config = this.registry.get(type) || {};

        const finalEnergy = energy !== null
            ? energy
            : (config.baseEnergy || 0);

        const cell = cellManager.createCell({
            type,
            ownerId,
            energy: finalEnergy
        });

        eventBus.publish('cell.factory.created', {
            cellId: cell.id,
            ownerId,
            type
        });

        return cell;
    }

    // إنشاء خلية مستخدم
    createUserCell(userId) {
        return this.createCell({
            type: 'userCell',
            ownerId: userId
        });
    }

    // إنشاء خلية لعبة
    createGameCell(userId) {
        return this.createCell({
            type: 'gameCell',
            ownerId: userId
        });
    }

    // إنشاء خلية حلم
    createDreamCell(userId) {
        return this.createCell({
            type: 'dreamCell',
            ownerId: userId
        });
    }

    // إنشاء خلايا تلقائية حسب الإعدادات
    autoCreateCellsForUser(userId) {
        this.registry.forEach((config, type) => {
            if (config.autoCreate) {
                this.createCell({
                    type,
                    ownerId: userId
                });
            }
        });

        eventBus.publish('cell.factory.autoCreated', { userId });
    }

    // إنشاء خلية ديناميكية حسب الإشارة
    createFromSignal({ signalType, userId, intensity = 1 }) {
        let type = 'generic';

        switch (signalType) {
            case 'game':
                type = 'gameCell';
                break;
            case 'dream':
                type = 'dreamCell';
                break;
            case 'user':
                type = 'userCell';
                break;
            default:
                type = 'generic';
        }

        const baseConfig = this.registry.get(type) || {};
        const energy = Math.floor((baseConfig.baseEnergy || 10) * intensity);

        return this.createCell({
            type,
            ownerId: userId,
            energy
        });
    }

    // عرض الأنواع المسجلة
    getRegisteredTypes() {
        return Array.from(this.registry.keys());
    }
}

module.exports = new CellFactory();
