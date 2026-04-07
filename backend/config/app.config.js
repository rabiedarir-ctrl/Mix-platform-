// ===================================================
// Mix Platform - App Configuration (Unified)
// ===================================================

require("dotenv").config();

const os = require("os");

const appConfig = {
  // =========================
  // معلومات التطبيق
  // =========================
  app: {
    name: "Mix Platform",
    version: "1.0.0",
    description: "Unified Virtual Platform System",
    author: "Mix System",
    environment: process.env.NODE_ENV || "development",
    debug: process.env.DEBUG === "true" || true
  },

  // =========================
  // إعدادات السيرفر
  // =========================
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT, 10) || 3000,

    protocol: process.env.PROTOCOL || "http",

    get baseUrl() {
      return `${this.protocol}://${this.host === "0.0.0.0" ? "localhost" : this.host}:${this.port}`;
    },

    timeout: 30000,
    keepAlive: true
  },

  // =========================
  // إعدادات API
  // =========================
  api: {
    prefix: "/api",
    version: "v1",
    fullPrefix: "/api/v1",

    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  },

  // =========================
  // إعدادات CORS
  // =========================
  cors: {
    enabled: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },

  // =========================
  // إعدادات النظام
  // =========================
  system: {
    timezone: "UTC",
    language: "ar",
    encoding: "utf-8",

    maxMemory: os.totalmem(),
    cpuCores: os.cpus().length
  },

  // =========================
  // إعدادات التخزين
  // =========================
  storage: {
    type: "json", // json | db

    autoSave: true,
    saveInterval: 5000,

    validation: true
  },

  // =========================
  // إعدادات الأمان
  // =========================
  security: {
    helmet: true,
    xssProtection: true,
    contentSecurityPolicy: false,

    jwt: {
      enabled: true,
      secret: process.env.JWT_SECRET || "mix_secret_key",
      expiresIn: "7d"
    }
  },

  // =========================
  // إعدادات الأداء
  // =========================
  performance: {
    compression: true,
    cacheControl: true,

    requestLogging: true,
    responseTime: true
  },

  // =========================
  // إعدادات التطوير
  // =========================
  dev: {
    hotReload: true,
    logRequests: true,
    showErrors: true
  },

  // =========================
  // إعدادات الإنتاج
  // =========================
  production: {
    optimize: true,
    minify: true,
    secureCookies: true
  },

  // =========================
  // دوال مساعدة
  // =========================
  helpers: {
    isDev() {
      return appConfig.app.environment === "development";
    },

    isProd() {
      return appConfig.app.environment === "production";
    },

    getApiUrl() {
      return `${appConfig.server.baseUrl}${appConfig.api.fullPrefix}`;
    }
  }
};

// =========================
// Export
// =========================
module.exports = appConfig;
