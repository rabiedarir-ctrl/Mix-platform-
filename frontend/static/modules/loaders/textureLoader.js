// ===========================
// 🔹 Texture Loader Module
// ===========================

import * as THREE from "three";

class TextureLoaderManager {
    constructor() {
        this.loader = new THREE.TextureLoader();
        this.cache = {};
    }

    // ===========================
    // 🔹 تحميل Texture
    // ===========================
    load(url, options = {}) {
        return new Promise((resolve, reject) => {

            // Cache
            if (this.cache[url]) {
                resolve(this.cache[url]);
                return;
            }

            this.loader.load(
                url,
                (texture) => {

                    // إعدادات إضافية
                    if (options.repeat) {
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(options.repeat.x, options.repeat.y);
                    }

                    if (options.flipY !== undefined) {
                        texture.flipY = options.flipY;
                    }

                    this.cache[url] = texture;
                    resolve(texture);
                },
                undefined,
                (error) => {
                    console.error("Texture Load Error:", error);
                    reject(error);
                }
            );
        });
    }
}

// ===========================
// 🔹 تصدير instance جاهز
// ===========================
const textureLoader = new TextureLoaderManager();
export default textureLoader;
