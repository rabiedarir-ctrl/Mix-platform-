// ===========================
// 🔹 Ground Object for Mix Platform
// ===========================
import * as THREE from "three";

export default class Ground {
    constructor(options = {}) {
        const width = options.width || 1000;
        const height = options.height || 1000;
        const color = options.color || 0x228B22; // لون الأرض (أخضر طبيعي)
        const textureURL = options.texture || null;

        let material;

        if (textureURL) {
            const loader = new THREE.TextureLoader();
            const texture = loader.load(textureURL);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(50, 50);
            material = new THREE.MeshPhongMaterial({ map: texture });
        } else {
            material = new THREE.MeshPhongMaterial({ color });
        }

        this.ground = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            material
        );

        this.ground.rotation.x = -Math.PI / 2; // جعل الأرضية أفقية
        this.ground.receiveShadow = true;
    }

    getObject() {
        return this.ground;
    }
}
