// ===================================================
// Mix Platform - Cache Configuration
// ===================================================

require("dotenv").config();

const path = require("path");

const cacheConfig = {
  // تفعيل الكاش
  enabled: process.env.CACHE_ENABLED === "true" || true,

  // استراتيجية التخزين: memory أو file
  strategy: process.env.CACHE_STRATEGY || "memory",

  // =========================
  // إعدادات Memory Cache
  // =========================
  memory: {
    maxItems: parseInt(process.env.CACHE_MEMORY_MAX, 10) || 1000,
    ttl: parseInt(process.env.CACHE_MEMORY_TTL, 10) || 3600, // بالثواني
    cleanupInterval: parseInt(process.env.CACHE_MEMORY_CLEANUP, 10) || 600 // بالثواني
  },

  // =========================
  // إعدادات File Cache
  // =========================
  file: {
    path: path.join(__dirname, "../../storage/cache"),
    ttl: parseInt(process.env.CACHE_FILE_TTL, 10) || 3600, // بالثواني
    cleanupInterval: parseInt(process.env.CACHE_FILE_CLEANUP, 10) || 600, // بالثواني
    maxSizeMB: parseInt(process.env.CACHE_FILE_MAXSIZE, 10) || 50 // الحد الأقصى للمجلد بالميجابايت
  },

  // =========================
  // Helpers
  // =========================
  helpers: {
    isMemory() {
      return cacheConfig.enabled && cacheConfig.strategy === "memory";
    },
    isFile() {
      return cacheConfig.enabled && cacheConfig.strategy === "file";
    }
  }
};

module.exports = cacheConfig;
