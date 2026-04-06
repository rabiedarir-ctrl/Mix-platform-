import time
import threading
import schedule
from self_heal import self_heal_engine
from logger import log_self_heal, log_info
from memory import users_memory

# ===============================
# 🔹 Scheduler Engine
# ===============================

class Scheduler:
    def __init__(self):
        self.jobs = []

    def add_job(self, func, interval_minutes=1, job_name=None):
        """
        إضافة مهمة دورية
        interval_minutes: كل كم دقيقة تعمل المهمة
        job_name: اسم المهمة للتسجيل
        """
        schedule.every(interval_minutes).minutes.do(self._wrap_job, func, job_name)
        log_info(f"Scheduled job '{job_name or func.__name__}' every {interval_minutes} min.")

    def _wrap_job(self, func, job_name):
        """
        تغليف الوظائف لتسجيل الأحداث والأخطاء
        """
        try:
            func()
            if job_name:
                log_info(f"Job '{job_name}' executed successfully.")
        except Exception as e:
            log_info(f"Job '{job_name}' failed: {e}")

    def run(self):
        """
        تشغيل scheduler في حلقة لا نهائية
        """
        while True:
            schedule.run_pending()
            time.sleep(1)

    def run_async(self):
        """
        تشغيل scheduler في Thread منفصل
        """
        t = threading.Thread(target=self.run, daemon=True)
        t.start()
        log_info("Scheduler started in background thread.")

# ===============================
# 🔹 Example: Self-Heal Job
# ===============================
def self_heal_job():
    """
    تحديث طاقة جميع المستخدمين
    """
    all_users = users_memory.all()
    for user in all_users:
        old_energy = user.get("energy", 100)
        updated_user = self_heal_engine.heal_user(user)
        new_energy = updated_user.get("energy", old_energy)
        log_self_heal(user_id=user["id"], old_energy=old_energy, new_energy=new_energy)

# ===============================
# 🔹 Scheduler Instance جاهز
# ===============================
scheduler = Scheduler()
# تشغيل self-heal كل 60 دقيقة
scheduler.add_job(self_heal_job, interval_minutes=60, job_name="Self-Heal Users")
scheduler.run_async()
