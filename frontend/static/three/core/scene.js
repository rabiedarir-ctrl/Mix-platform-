// ===========================
// 🔹 Three.js Scene Setup
// ===========================
import * as THREE from "three";

export default class SceneBuilder {
    constructor() {
        // إنشاء المشهد
        this.scene = new THREE.Scene();

        // إعداد الإضاءة الأساسية
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // إعداد الخلفية
        this.scene.background = new THREE.Color(0x87ceeb); // لون السماء

        console.log("✅ Scene initialized");
    }

    getScene() {
        return this.scene;
    }

    addObject(object) {
        this.scene.add(object);
    }

    removeObject(object) {
        this.scene.remove(object);
    }

    setBackground(colorHex) {
        this.scene.background = new THREE.Color(colorHex);
    }

    setFog(colorHex = 0x87ceeb, near = 10, far = 1000) {
        this.scene.fog = new THREE.Fog(colorHex, near, far);
    }
}
