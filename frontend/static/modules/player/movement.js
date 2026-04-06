// ===========================
// 🔹 Player Movement Module
// ===========================

class PlayerMovement {
    constructor(playerObject, options = {}) {
        this.player = playerObject; // camera أو Mesh
        this.speed = options.speed || 0.2;
        this.sprintMultiplier = options.sprintMultiplier || 1.5;
        this.jumpStrength = options.jumpStrength || 0.15;

        this.velocity = { x: 0, y: 0, z: 0 };
        this.onGround = false;

        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            sprint: false
        };

        this.initListeners();
    }

    // ===========================
    // 🔹 الاستماع لمفاتيح الحركة
    // ===========================
    initListeners() {
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
    }

    onKeyDown(e) {
        switch(e.code) {
            case "KeyW": this.keys.forward = true; break;
            case "KeyS": this.keys.backward = true; break;
            case "KeyA": this.keys.left = true; break;
            case "KeyD": this.keys.right = true; break;
            case "ShiftLeft": this.keys.sprint = true; break;
            case "Space": if (this.onGround) this.velocity.y = this.jumpStrength; break;
        }
    }

    onKeyUp(e) {
        switch(e.code) {
            case "KeyW": this.keys.forward = false; break;
            case "KeyS": this.keys.backward = false; break;
            case "KeyA": this.keys.left = false; break;
            case "KeyD": this.keys.right = false; break;
            case "ShiftLeft": this.keys.sprint = false; break;
        }
    }

    // ===========================
    // 🔹 تحديث الحركة
    // ===========================
    update() {
        let moveSpeed = this.speed;
        if (this.keys.sprint) moveSpeed *= this.sprintMultiplier;

        if (this.keys.forward) this.player.position.z -= moveSpeed;
        if (this.keys.backward) this.player.position.z += moveSpeed;
        if (this.keys.left) this.player.position.x -= moveSpeed;
        if (this.keys.right) this.player.position.x += moveSpeed;

        // تطبيق الجاذبية
        if (!this.onGround) {
            this.velocity.y -= 0.01; // Gravity
        }

        this.player.position.y += this.velocity.y;

        // أرضية بسيطة (يمكن استبدالها بالنظام الفيزيائي)
        if (this.player.position.y <= 0) {
            this.player.position.y = 0;
            this.velocity.y = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
    }
}

// ===========================
// 🔹 تصدير الوحدة
// ===========================
export default PlayerMovement;
