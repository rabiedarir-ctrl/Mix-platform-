// ===========================
// 🔹 استيراد Three.js Loader
// ===========================
import * as THREE from "../../three/three.module.js";
import { GLTFLoader } from "../../three/GLTFLoader.js";

// ===========================
// 🔹 مدير Avatars
// ===========================
export default class AvatarLoader {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();

        this.avatars = new Map(); // userId -> avatar
    }

    // ===========================
    // 🔹 تحميل Avatar
    // ===========================
    loadAvatar(userId, modelPath = "/assets/models/avatar.glb") {
        return new Promise((resolve, reject) => {
            this.loader.load(
                modelPath,
                (gltf) => {
                    const avatar = gltf.scene;

                    // إعداد الحجم والموقع
                    avatar.scale.set(1, 1, 1);
                    avatar.position.set(0, 0, 0);

                    // حفظه
                    this.avatars.set(userId, avatar);

                    // إضافته للمشهد
                    this.scene.add(avatar);

                    resolve(avatar);
                },
                undefined,
                (err) => {
                    console.error("Avatar Load Error:", err);
                    reject(err);
                }
            );
        });
    }

    // ===========================
    // 🔹 جلب أو إنشاء Avatar
    // ===========================
    async getOrCreateAvatar(userId) {
        if (this.avatars.has(userId)) {
            return this.avatars.get(userId);
        }

        return await this.loadAvatar(userId);
    }

    // ===========================
    // 🔹 تحديث موقع Avatar
    // ===========================
    updateAvatar(userId, position) {
        const avatar = this.avatars.get(userId);
        if (!avatar) return;

        avatar.position.set(position.x, position.y, position.z);
    }

    // ===========================
    // 🔹 حذف Avatar
    // ===========================
    removeAvatar(userId) {
        const avatar = this.avatars.get(userId);
        if (!avatar) return;

        this.scene.remove(avatar);
        this.avatars.delete(userId);
    }
}
