// Energy Engine - التحكم في الطاقة والضغط

class EnergyEngine {
  constructor() {
    this.energy = 1;
    this.pressure = 0;
    this.maxEnergy = 5;
  }

  // تحديث الطاقة حسب الكثافة
  update(density) {
    // ضغط = الكثافة
    this.pressure = density;

    // توليد طاقة
    this.energy += density * 0.1;

    // استهلاك طبيعي
    this.energy -= 0.05;

    if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
    if (this.energy < 0) this.energy = 0;

    return {
      energy: this.energy,
      pressure: this.pressure
    };
  }

  // حالة خطر
  isCritical() {
    return this.pressure > 0.8;
  }
}

module.exports = EnergyEngine;
