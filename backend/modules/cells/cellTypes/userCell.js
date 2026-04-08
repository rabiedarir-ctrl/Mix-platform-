// backend/modules/cells/cellTypes/userCell.js

const Cell = require('../cell');
const eventBus = require('../../../core/eventBus');

class UserCell extends Cell {
    constructor({ ownerId, energy = 100 }) {
        super({
            type: 'userCell',
            ownerId,
            energy
        });

        // خصائص إضافية خاصة بالمستخدم
        this.level = 1;
        this.experience = 0;
        this.state = 'normal'; // normal | focused | exhausted
    }

    // إضافة خبرة
    addExperience(amount) {
        this.experience += amount;

        // كل 100 خبرة = Level Up
        while (this.experience >= 100) {
            this.experience -= 100;
            this.levelUp();
        }

        eventBus.publish('userCell.experience', {
            cellId: this.id,
            ownerId: this.ownerId,
            experience: this.experience,
            level: this.level
        });
    }

    // رفع المستوى
    levelUp() {
        this.level += 1;

        // مكافأة طاقة عند الترقية
        this.updateEnergy(50);

        eventBus.publish('userCell.levelUp', {
            cellId: this.id,
            ownerId: this.ownerId,
            level: this.level
        });
    }

    // استهلاك طاقة (مثلاً عند نشاط)
    consumeEnergy(amount) {
        if (this.energy < amount) {
            this.setState('exhausted');
            return false;
        }

        this.updateEnergy(-amount);
        this.addExperience(amount);

        this.evaluateState();
        return true;
    }

    // استرجاع طاقة (راحة أو مكافأة)
    recoverEnergy(amount) {
        this.updateEnergy(amount);
        this.evaluateState();

        eventBus.publish('userCell.recovered', {
            cellId: this.id,
            ownerId: this.ownerId,
            energy: this.energy
        });
    }

    // تغيير الحالة الذهنية/الطاقية
    setState(newState) {
        const validStates = ['normal', 'focused', 'exhausted'];
        if (!validStates.includes(newState)) return;

        this.state = newState;

        eventBus.publish('userCell.stateChanged', {
            cellId: this.id,
            ownerId: this.ownerId,
            state: this.state
        });
    }

    // تقييم الحالة بناءً على الطاقة
    evaluateState() {
        if (this.energy <= 20) {
            this.setState('exhausted');
        } else if (this.energy >= 150) {
            this.setState('focused');
        } else {
            this.setState('normal');
        }
    }

    // إعادة تعريف getInfo لإضافة بيانات المستخدم
    getInfo() {
        return {
            ...super.getInfo(),
            level: this.level,
            experience: this.experience,
            state: this.state
        };
    }
}

module.exports = UserCell;
