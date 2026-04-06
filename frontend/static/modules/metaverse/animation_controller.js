// ===========================
// 🔹 استيراد Three.js
// ===========================
import * as THREE from "../../three/three.module.js";

// ===========================
// 🔹 Animation Controller
// ===========================
export default class AnimationController {
    constructor(avatar, animations = []) {
        this.avatar = avatar;

        // Mixer
        this.mixer = new THREE.AnimationMixer(avatar);

        // تخزين الأنيميشن
        this.actions = {};
        this.currentAction = null;

        // تحميل الأنيميشن
        animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name.toLowerCase()] = action;
        });

        // تشغيل idle افتراضي
        this.play("idle");
    }

    // ===========================
    // 🔹 تشغيل أنيميشن
    // ===========================
    play(name) {
        const action = this.actions[name];
        if (!action) return;

        // إذا نفس الأنيميشن لا تعيد تشغيله
        if (this.currentAction === action) return;

        // إيقاف السابق بسلاسة
        if (this.currentAction) {
            this.currentAction.fadeOut(0.3);
        }

        // تشغيل الجديد
        action.reset().fadeIn(0.3).play();
        this.currentAction = action;
    }

    // ===========================
    // 🔹 تحديث الأنيميشن
    // ===========================
    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }

    // ===========================
    // 🔹 تحديد الحركة حسب السرعة
    // ===========================
    updateByVelocity(velocity) {
        const speed = Math.sqrt(
            velocity.x * velocity.x +
            velocity.z * velocity.z
        );

        if (speed === 0) {
            this.play("idle");
        } else if (speed < 0.15) {
            this.play("walk");
        } else {
            this.play("run");
        }
    }
}
