import * as THREE from '../core/three.module.js';

class DreamWorld {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.objects = []; // جميع الكائنات في العالم

        // إعداد الإضاءة
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(directionalLight);

        // إعداد الأرضية
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x223344 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // إعداد السماء
        this.scene.background = new THREE.Color(0x000022);

        // موقع الكاميرا
        this.camera.position.set(0, 10, 30);

        // بدء حلقة التحديث
        this.animate = this.animate.bind(this);
        this.animate();
    }

    // -------------------------------
    // 🔹 إضافة كائن للعالم
    addObject(obj) {
        this.scene.add(obj.mesh);
        this.objects.push(obj);
    }

    // -------------------------------
    // 🔹 إنشاء كائن جديد
    createObject({ name, id, position, color = 0xffffff, size = 1 }) {
        const geometry = new THREE.SphereGeometry(size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position.x, position.y, position.z);
        return { name, id, mesh, rotationSpeed: 0.01 };
    }

    // -------------------------------
    // 🔹 حلقة التحديث
    animate() {
        requestAnimationFrame(this.animate);
        this.objects.forEach(obj => {
            obj.mesh.rotation.y += obj.rotationSpeed || 0.01;
        });
        this.renderer.render(this.scene, this.camera);
    }
}

// -------------------------------
// 🔹 إنشاء نسخة عالمية
window.DreamWorld = new DreamWorld("dreamWorldContainer");

// -------------------------------
// 🔹 التصدير
export default window.DreamWorld;
