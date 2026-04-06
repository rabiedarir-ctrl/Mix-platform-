#!/bin/bash
# ==========================================
# Auto Start Script for Mix Platform
# يشغّل كل خدمات Mix Platform تلقائيًا
# مع التحقق من الملفات وتصحيح الأخطاء الشائعة
# ==========================================

# ===============================
# 1. تحميل إعدادات المشروع
# ===============================
CONFIG_FILE="../mix.config.json"
if [[ ! -f $CONFIG_FILE ]]; then
    echo "[ERROR] ملف mix.config.json غير موجود!"
    exit 1
fi

echo "[INFO] تحميل إعدادات Mix Platform..."
API_BASE=$(jq -r '.backend.port' $CONFIG_FILE)
FRONTEND_PATH=$(jq -r '.frontend.staticPath' $CONFIG_FILE)
BACKEND_PATH="backend"
LOGS_PATH=$(jq -r '.logs.system' $CONFIG_FILE)

# ===============================
# 2. التحقق من الملفات الأساسية
# ===============================
echo "[INFO] التحقق من الملفات والمجلدات..."
REQUIRED_FILES=(
    "$FRONTEND_PATH/index.html"
    "$FRONTEND_PATH/style.css"
    "$FRONTEND_PATH/engine.js"
    "$FRONTEND_PATH/scene.js"
    "$FRONTEND_PATH/dashboard.js"
    "backend/server.js"
)

for f in "${REQUIRED_FILES[@]}"; do
    if [[ ! -f $f ]]; then
        echo "[WARN] الملف مفقود: $f"
        touch $f
        echo "[INFO] تم إنشاء الملف افتراضيًا: $f"
    fi
done

# ===============================
# 3. تشغيل Backend
# ===============================
echo "[INFO] تشغيل Backend على المنفذ $API_BASE..."
cd backend
if pgrep -f server.js > /dev/null; then
    echo "[INFO] Backend يعمل بالفعل، سيتم إعادة التشغيل..."
    pkill -f server.js
fi
nohup node server.js > logs/backend.log 2>&1 &
cd ..

# ===============================
# 4. تشغيل Frontend (Local Server)
# ===============================
echo "[INFO] تشغيل Frontend..."
if command -v live-server >/dev/null 2>&1; then
    nohup live-server $FRONTEND_PATH --port=8080 > logs/frontend.log 2>&1 &
else
    echo "[WARN] live-server غير مثبت، يمكنك تثبيته عبر: npm install -g live-server"
fi

# ===============================
# 5. التحقق من Assets و Storage
# ===============================
echo "[INFO] التحقق من مجلدات Assets و Storage..."
mkdir -p frontend/assets/models
mkdir -p frontend/assets/textures
mkdir -p frontend/assets/audio
mkdir -p frontend/assets/objects
mkdir -p frontend/storage

# ===============================
# 6. تشغيل Scripts أساسية
# ===============================
echo "[INFO] تشغيل سكريبت check.sh..."
bash scripts/check.sh

# ===============================
# 7. التحقق من Logs
# ===============================
echo "[INFO] التحقق من ملفات Logs..."
mkdir -p backend/logs
touch backend/logs/system.log
touch backend/logs/cache.log
touch backend/logs/backend.log

# ===============================
# 8. النهاية
# ===============================
echo "[SUCCESS] Mix Platform جاهز للعمل!"
echo "[INFO] Frontend متاح على http://localhost:8080"
echo "[INFO] Backend متاح على http://localhost:$API_BASE"
echo "[INFO] تحقق من السجلات في logs/"
