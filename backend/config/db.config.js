// ===================================================
// Mix Platform - Database Configuration
// ===================================================

require("dotenv").config();

const path = require("path");

const dbConfig = {
  // =========================
  // النوع المستخدم حالياً
  // =========================
  default: process.env.DB_TYPE || "json", // json | mysql | mongodb

  // =========================
  // إعدادات JSON (التخزين المحلي)
  // =========================
  json: {
    enabled: true,
    storagePath: path.join(__dirname, "../../storage"),
    autoSave: true,
    saveInterval: 5000, // بالمللي ثانية
    validation: true
  },

  // =========================
  // إعدادات MySQL
  // =========================
  mysql: {
    enabled: process.env.MYSQL_ENABLED === "true" || false,
    host: process.env.MYSQL_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASS || "",
    database: process.env.MYSQL_DB || "mix_platform",
    connectionLimit: 10
  },

  // =========================
  // إعدادات MongoDB
  // =========================
  mongodb: {
    enabled: process.env.MONGO_ENABLED === "true" || false,
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/mix_platform",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  // =========================
  // دوال مساعدة
  // =========================
  helpers: {
    isJson() {
      return dbConfig.default === "json" && dbConfig.json.enabled;
    },

    isMySQL() {
      return dbConfig.default === "mysql" && dbConfig.mysql.enabled;
    },

    isMongo() {
      return dbConfig.default === "mongodb" && dbConfig.mongodb.enabled;
    }
  }
};

module.exports = dbConfig;
