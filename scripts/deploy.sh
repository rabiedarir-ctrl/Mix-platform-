#!/bin/bash

# ===================================================
# Mix Platform - Unified Deployment Script
# ===================================================
# هذا السكريبت يقوم بـ:
# - التحقق من البيئة
# - بناء Frontend
# - رفع الملفات إلى السيرفر أو المسار الإنتاجي
# ===================================================

# ---------- إعداد البيئة ----------
echo "🔹 التحقق من البيئة قبل النشر..."
if [ ! -f "./.env" ]; then
  echo "⚠️  ملف البيئة غير موجود! انسخ .env.example إلى .env"
  cp .env.example .env
fi

# ---------- بناء Frontend ----------
echo "🚀 بناء Frontend..."
cd frontend || { echo "❌ مجلد frontend غير موجود!"; exit 1; }

# تثبيت الاعتماديات إذا لزم الأمر
if [ ! -d "node_modules" ]; then
  echo "📦 تثبيت الاعتماديات..."
  npm install
fi

# بناء المشروع (مثلاً باستخدام React / Vite / Webpack)
if [ -f "package.json" ]; then
  if grep -q "\"build\":" package.json; then
    echo "🎯 بدء عملية البناء..."
    npm run build
  else
    echo "⚠️  لا يوجد سكريبت build في package.json، سيتم استخدام الملفات الحالية."
  fi
else
  echo "❌ package.json غير موجود!"
fi
cd ..

# ---------- رفع الملفات إلى السيرفر ----------
# يمكن تعديل المسار حسب بيئة الإنتاج أو السيرفر
DEPLOY_DIR="/var/www/mix-platform"
echo "📤 رفع الملفات إلى $DEPLOY_DIR..."

# التأكد من وجود المجلد
mkdir -p "$DEPLOY_DIR"

# نسخ Backend
cp -r backend/* "$DEPLOY_DIR/backend"

# نسخ Frontend بعد البناء
if [ -d "frontend/dist" ]; then
  cp -r frontend/dist/* "$DEPLOY_DIR/frontend"
else
  cp -r frontend/* "$DEPLOY_DIR/frontend"
fi

# نسخ الملفات الثابتة الأخرى
cp -r storage "$DEPLOY_DIR/storage"
cp -r assets "$DEPLOY_DIR/assets"
cp -r scripts "$DEPLOY_DIR/scripts"

echo "✅ الملفات تم رفعها بنجاح!"

# ---------- تشغيل المشروع بعد النشر ----------
echo "🚀 تشغيل Mix Platform على السيرفر..."
cd "$DEPLOY_DIR/backend" || exit 1
nohup node server.js > ../storage/logs/backend.log 2>&1 &
echo "✅ Backend يعمل في الخلفية، سجل الأحداث في backend.log"

echo "🔹 نشر المشروع اكتمل!"
