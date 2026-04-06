// ===========================
// 🔹 Player Physics & Collision Module
// ===========================

class PlayerPhysics {
    constructor(playerObject, scene, options = {}) {
        this.player = playerObject; // يمكن أن يكون camera أو Mesh
        this.scene = scene;

        this.gravity = options.gravity || -0.01;
        this.speed = options.speed || 0.2;
        this.jumpStrength = options.jumpStrength || 0.15;

        this.velocity = { x: 0, y: 0, z: 0 };
        this.onGround = false;

        this.collidableObjects = []; // قائمة العناصر للتصادم معها
    }

    // ===========================
    // 🔹 إضافة عناصر للتصادم
    // ===========================
    addCollidable(object) {
        this.collidableObjects.push(object);
    }

    // ===========================
    // 🔹 التحقق من التصادم
    // ===========================
    checkCollisions(nextPos) {
        for (let obj of this.collidableObjects) {
            const dx = nextPos.x - obj.position.x;
            const dy = nextPos.y - obj.position.y;
            const dz = nextPos.z - obj.position.z;

            const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            const minDist = (this.player.scale.x/2) + (obj.scale.x/2);

            if (distance < minDist) {
                return true; // تصادم
            }
        }
        return false;
    }

    // ===========================
    // 🔹 تحديث الحركة والفيزياء
    // ===========================
    update(keys) {
        // تطبيق الجاذبية
        if (!this.onGround) {
            this.velocity.y += this.gravity;
        }

        // حساب الحركة
        let nextPos = {
            x: this.player.position.x,
            y: this.player.position.y + this.velocity.y,
            z: this.player.position.z
        };

        if (keys.forward) nextPos.z -= this.speed;
        if (keys.backward) nextPos.z += this.speed;
        if (keys.left) nextPos.x -= this.speed;
        if (keys.right) nextPos.x += this.speed;

        // التحقق من التصادم
        if (!this.checkCollisions(nextPos)) {
            this.player.position.copy(nextPos);
            this.onGround = false;
        } else {
            this.velocity.y = 0;
            this.onGround = true;
        }
    }

    // ===========================
    // 🔹 القفز
    // ===========================
    jump() {
        if (this.onGround) {
            this.velocity.y = this.jumpStrength;
            this.onGround = false;
        }
    }
}

// ===========================
// 🔹 تصدير الوحدة
// ===========================
export default PlayerPhysics;
