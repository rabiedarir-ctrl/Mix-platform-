// backend/modules/cells/cellTypes/dreamCell.js

const Cell = require('../cell');
const eventBus = require('../../../core/eventBus');

class DreamCell extends Cell {
    constructor({ ownerId, energy = 30 }) {
        super({
            type: 'dreamCell',
            ownerId,
            energy
        });

        // خصائص إدراكية
        this.dreamState = 'idle'; // idle | dreaming | interpreting
        this.symbols = [];        // رموز/إشارات مستقبلة
        this.patterns = [];       // أنماط مستنتجة
        this.intensity = 1;       // شدة الحلم (0 - 10)
    }

    // بدء الحلم
    startDream() {
        this.dreamState = 'dreaming';

        eventBus.publish('dreamCell.started', {
            cellId: this.id,
            ownerId: this.ownerId
        });
    }

    // إنهاء الحلم
    endDream() {
        this.dreamState = 'idle';

        eventBus.publish('dreamCell.ended', {
            cellId: this.id,
            ownerId: this.ownerId
        });

        // تحليل تلقائي بعد الانتهاء
        this.interpretDream();
    }

    // استقبال إشارة (من cognitiveEngine أو signalTranslator)
    receiveSignal(signal) {
        this.symbols.push(signal);

        // زيادة الطاقة حسب الشدة
        this.updateEnergy(Math.floor(signal.intensity || 1));

        eventBus.publish('dreamCell.signalReceived', {
            cellId: this.id,
            ownerId: this.ownerId,
            signal
        });

        // إذا كثرت الإشارات → يبدأ الحلم تلقائي
        if (this.symbols.length >= 3 && this.dreamState === 'idle') {
            this.startDream();
        }
    }

    // تحليل الحلم (تحويل الرموز إلى أنماط)
    interpretDream() {
        if (this.symbols.length === 0) return;

        this.dreamState = 'interpreting';

        const patterns = [];

        // تحليل بسيط: تجميع الإشارات حسب النوع
        const grouped = {};

        this.symbols.forEach(signal => {
            const type = signal.type || 'unknown';
            if (!grouped[type]) grouped[type] = 0;
            grouped[type] += 1;
        });

        for (let type in grouped) {
            patterns.push({
                type,
                frequency: grouped[type],
                weight: grouped[type] * this.intensity
            });
        }

        this.patterns = patterns;

        // تفريغ الرموز بعد التحليل
        this.symbols = [];

        eventBus.publish('dreamCell.interpreted', {
            cellId: this.id,
            ownerId: this.ownerId,
            patterns: this.patterns
        });

        // إعادة الحالة
        this.dreamState = 'idle';
    }

    // تعديل شدة الحلم
    setIntensity(value) {
        if (value < 0 || value > 10) return;
        this.intensity = value;

        eventBus.publish('dreamCell.intensityChanged', {
            cellId: this.id,
            ownerId: this.ownerId,
            intensity: this.intensity
        });
    }

    // استهلاك طاقة أثناء الحلم
    consumeEnergy(amount) {
        if (this.energy < amount) {
            this.endDream();
            return false;
        }

        this.updateEnergy(-amount);
        return true;
    }

    // إعادة تعيين الحلم
    resetDream() {
        this.symbols = [];
        this.patterns = [];
        this.dreamState = 'idle';
        this.intensity = 1;

        this.reset();

        eventBus.publish('dreamCell.reset', {
            cellId: this.id,
            ownerId: this.ownerId
        });
    }

    // معلومات موسعة
    getInfo() {
        return {
            ...super.getInfo(),
            dreamState: this.dreamState,
            symbols: this.symbols,
            patterns: this.patterns,
            intensity: this.intensity
        };
    }
}

module.exports = DreamCell;
