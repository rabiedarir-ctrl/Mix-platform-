// ===========================
// 🔹 Dream World Full Integration
// ===========================

import * as THREE from "three";
import DreamWorld from "./dreamWorld.js";
import PlayerFull from "../player/player_full.js";

export default class DreamWorldFull {
    constructor(engine, options = {}) {
        this.engine = engine;
        this.scene = engine.getScene();
        this.camera = engine.getCamera();

        // ===========================
        // 🔹 إنشاء عالم الأحلام
        // ===========================
        this.world = new DreamWorld(this.scene, {
            groundColor: 0x9933ff,
            groundSize: { width: 200, height: 1, depth: 200 }
        });

        // ===========================
        // 🔹 إنشاء العملات
        // ===========================
        this.coins = [];
        this.createCoins(20);

        // ===========================
        // 🔹 إنشاء اللاعب
        // ===========================
        this.player = new PlayerFull(this.camera, this.scene, {
            speed: 0.2,
            sprintMultiplier: 2,
            jumpStrength: 0.2,
            color: 0xff00ff,
            groundMesh: this.world.groundMesh,
            coins: this.coins
        });

        // ===========================
        // 🔹 Dashboard و Wallet
        // ===========================
        this.wallet = 0;
        this.score = 0;

        this.walletElement = document.getElementById("wallet-balance");
        this.scoreElement = document.getElementById("score");
        this.notifications = document.getElementById("notifications");

        // ===========================
        // 🔹 ربط جمع العملات
        // ===========================
        this.player.setCoinCallback((coin) => {
            this.onCoinCollected(coin);
        });

        // ===========================
        // 🔹 ربط التحديث مع Engine Loop
        // ===========================
        this.engine.addUpdateFunction(() => this.update());
    }

    // ===========================
    // 🔹 إنشاء العملات
    // ===========================
    createCoins(count) {
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0xffd700 });

        for (let i = 0; i < count; i++) {
            const coin = new THREE.Mesh(geometry, material);
            coin.position.set(
                (Math.random() - 0.5) * 100,
                0.5,
                (Math.random() - 0.5) * 100
            );

            this.scene.add(coin);
            this.coins.push(coin);
        }
    }

    // ===========================
    // 🔹 عند جمع عملة
    // ===========================
    onCoinCollected(coin) {
        this.score += 1;
        this.wallet += 0.002;

        if (this.scoreElement) {
            this.scoreElement.innerText = `Score: ${this.score}`;
        }

        if (this.walletElement) {
            this.walletElement.innerText = `Wallet: ${this.wallet.toFixed(3)} BTC`;
        }

        this.showNotification("🌙 Dream Coin Collected! +0.002 BTC");
    }

    // ===========================
    // 🔹 إشعارات
    // ===========================
    showNotification(message, duration = 2000) {
        if (!this.notifications) return;

        const notif = document.createElement("div");
        notif.className = "notification";
        notif.innerText = message;

        this.notifications.appendChild(notif);

        setTimeout(() => {
            this.notifications.removeChild(notif);
        }, duration);
    }

    // ===========================
    // 🔹 تحديث العالم بالكامل
    // ===========================
    update() {
        this.world.update(0.016);
        this.player.update();

        // تدوير العملات
        this.coins.forEach(coin => {
            coin.rotation.y += 0.02;
        });
    }
             }
