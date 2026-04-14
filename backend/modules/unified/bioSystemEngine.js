const ConsciousnessEngine = require("../consciousness/consciousnessEngine");
const EnergyEngine = require("./energyEngine");
const CellsEngine = require("./cellsEngine");

class BioSystemEngine {
  constructor() {
    this.consciousness = new ConsciousnessEngine();
    this.energy = new EnergyEngine();
    this.cells = new CellsEngine(12);
  }

  tick(inputFrequencies = []) {
    // 1. تشغيل الوعي
    const c = this.consciousness.tick(inputFrequencies);

    // 2. تحديث الطاقة حسب الكثافة
    const e = this.energy.update(c.density);

    // 3. توزيع الطاقة على الخلايا
    this.cells.distributeEnergy(e.energy);

    // 4. استهلاك حسب النشاط
    if (c.mode === "active") {
      this.cells.consumeEnergy(0.1);
    }

    // 5. حالة الخطر
    let alert = null;
    if (this.energy.isCritical()) {
      alert = "ضغط عالي - خطر انهيار";
    }

    return {
      consciousness: c,
      energy: e,
      cells: this.cells.getStatus(),
      alert
    };
  }
}

module.exports = BioSystemEngine;
