#!/bin/bash

# ===================================================
# Mix Platform - Unified Backup Script
# ===================================================
# هذا السكريبت يقوم بـ:
# - إنشاء نسخة احتياطية من ملفات المشروع الأساسية
# - حفظ النسخة الاحتياطية مع طابع زمني
# - إدارة النسخ الاحتياطية القديمة (اختياري)
# ===================================================

# ---------- إعداد المتغيرات ----------
PROJECT_DIR=$(pwd)
BACKUP_DIR="$PROJECT_DIR/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/mix_platform_backup_$TIMESTAMP.tar.gz"

# ---------- إنشاء مجلد النسخ الاحتياطية إذا لم يكن موجود ----------
mkdir -p "$BACKUP_DIR"

echo "🔹 بدء النسخ الاحتياطي لمشروع Mix Platform..."
echo "📁 المجلدات الأساسية: backend, frontend, storage, assets, scripts"

# ---------- ضغط الملفات الأساسية ----------
tar -czf "$BACKUP_FILE" backend frontend storage assets scripts

if [ $? -eq 0 ]; then
  echo "✅ النسخ الاحتياطي اكتمل بنجاح!"
  echo "📦 الملف الاحتياطي: $BACKUP_FILE"
else
  echo "❌ حدث خطأ أثناء إنشاء النسخ الاحتياطي!"
  exit 1
fi

# ---------- إدارة النسخ الاحتياطية القديمة (اختياري) ----------
# الاحتفاظ بآخر 5 نسخ فقط
MAX_BACKUPS=5
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/*.tar.gz 2>/dev/null | wc -l)

if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
  echo "🗑️ حذف النسخ الاحتياطية القديمة..."
  ls -1t "$BACKUP_DIR"/*.tar.gz | tail -n +$((MAX_BACKUPS+1)) | xargs rm -f
  echo "✅ تم حذف النسخ القديمة"
fi

echo "🔹 النسخ الاحتياطي جاهز!"
