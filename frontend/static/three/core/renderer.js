// ===========================
// 🔹 Three.js Renderer Setup
// ===========================
import * as THREE from "three";

export default class RendererBuilder {
    constructor(scene, camera, options = {}) {
        // إعداد الـ Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: options.antialias !== undefined ? options.antialias : true,
            alpha: options.alpha !== undefined ? options.alpha : false,
        });

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        this.renderer.setPixelRatio(window.devicePixelRatio);

        if (options.shadowMap) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        // ربط الـ Renderer بالـ DOM
        const container = options.containerId
            ? document.getElementById(options.containerId)
            : document.body;
        container.appendChild(this.renderer.domElement);

        // تحديث الحجم عند تغيير حجم النافذة
        window.addEventListener("resize", () => this.onWindowResize(), false);

        console.log("✅ Renderer initialized");
    }

    getRenderer() {
        return this.renderer;
    }

    render(scene, camera) {
        this.renderer.render(scene, camera);
    }

    onWindowResize() {
        if (!this.renderer) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.renderer.setSize(width, height);

        if (this.camera) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }
  }
