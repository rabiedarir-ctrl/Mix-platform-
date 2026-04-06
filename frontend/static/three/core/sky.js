// ===========================
// 🔹 Three.js Sky Setup
// ===========================
import * as THREE from "three";

export default class Sky {
    constructor(scene, options = {}) {
        this.scene = scene;

        // إعداد لون السماء الافتراضي
        this.color = options.color || 0x87ceeb; // أزرق فاتح
        this.intensity = options.intensity || 0.5;

        // إنشاء كرة السماء (Sky Sphere)
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: this.color,
            side: THREE.BackSide,
            fog: false
        });

        this.skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(this.skyMesh);

        console.log("✅ Sky initialized");
    }

    // ===========================
    // 🔹 تغيير لون السماء ديناميكياً
    // ===========================
    setColor(hexColor) {
        this.skyMesh.material.color.setHex(hexColor);
    }

    // ===========================
    // 🔹 تحريك السماء (مثلاً دوران الشمس)
    // ===========================
    rotate(speed = 0.001) {
        this.skyMesh.rotation.y += speed;
    }
  }
