// ===================================================
// Mix Platform - Paths Configuration
// ===================================================

const path = require("path");

const pathsConfig = {
  // =========================
  // الجذر الرئيسي للمشروع
  // =========================
  root: path.resolve(__dirname, "../../"),

  // =========================
  // مجلدات التخزين الأساسية
  // =========================
  storage: path.join(__dirname, "../../storage"),
  worlds: path.join(__dirname, "../../storage/worlds"),
  cache: path.join(__dirname, "../../storage/cache"),
  users: path.join(__dirname, "../../storage/users.json"),
  social: path.join(__dirname, "../../storage/social.json"),
  messages: path.join(__dirname, "../../storage/messages.json"),
  wallets: path.join(__dirname, "../../storage/wallets.json"),
  dreams: path.join(__dirname, "../../storage/dreams.json"),
  dreamWorlds: path.join(__dirname, "../../storage/dream_worlds.json"),

  // =========================
  // مجلد Assets للـ Frontend
  // =========================
  assets: {
    root: path.join(__dirname, "../../frontend/assets"),
    models: path.join(__dirname, "../../frontend/assets/models"),
    objects: path.join(__dirname, "../../frontend/assets/models/objects"),
    textures: path.join(__dirname, "../../frontend/assets/textures"),
    audio: path.join(__dirname, "../../frontend/assets/audio")
  },

  // =========================
  // Frontend
  // =========================
  frontend: {
    root: path.join(__dirname, "../../frontend"),
    static: path.join(__dirname, "../../frontend/static"),
    html: path.join(__dirname, "../../frontend/index.html"),
    style: path.join(__dirname, "../../frontend/static/style.css"),
    engine: path.join(__dirname, "../../frontend/static/engine.js"),
    scene: path.join(__dirname, "../../frontend/static/scene.js"),
    dashboard: path.join(__dirname, "../../frontend/static/dashboard.js")
  },

  // =========================
  // Backend Logs
  // =========================
  logs: {
    root: path.join(__dirname, "../logs"),
    system: path.join(__dirname, "../logs/system.log"),
    backend: path.join(__dirname, "../logs/backend.log"),
    cache: path.join(__dirname, "../logs/cache.log")
  },

  // =========================
  // سكريبتات
  // =========================
  scripts: {
    root: path.join(__dirname, "../../scripts"),
    start: path.join(__dirname, "../../scripts/start.sh"),
    check: path.join(__dirname, "../../scripts/check.sh"),
    deploy: path.join(__dirname, "../../scripts/deploy.sh"),
    backup: path.join(__dirname, "../../scripts/backup.sh")
  },

  // =========================
  // Helpers
  // =========================
  helpers: {
    getAssetModel(name) {
      return path.join(pathsConfig.assets.models, `${name}.glb`);
    },
    getTexture(name) {
      return path.join(pathsConfig.assets.textures, `${name}.png`);
    },
    getAudio(name) {
      return path.join(pathsConfig.assets.audio, `${name}.mp3`);
    }
  }
};

module.exports = pathsConfig;
