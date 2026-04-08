// ===========================
// 🔹 استيراد API
// ===========================
import { DreamsAPI } from "./api.js";

// ===========================
// 🔹 الحالة العامة
// ===========================
let dreamsCache = [];
let currentDream = null;

// ===========================
// 🔹 عناصر DOM
// ===========================
const dreamsListEl = document.getElementById("dreamsList");
const dreamStatusEl = document.getElementById("dreamStatus");

// ===========================
// 🔹 جلب الأحلام من Backend
// ===========================
export async function loadDreams() {
    try {
        const data = await DreamsAPI.getDreams();

        if (!data || data.error) {
            setStatus("❌ فشل تحميل الأحلام");
            return;
        }

        dreamsCache = data;
        renderDreamsList();
        setStatus("✅ تم تحميل الأحلام");

    } catch (err) {
        console.error("Dreams Load Error:", err);
        setStatus("❌ خطأ في الاتصال");
    }
}

// ===========================
// 🔹 عرض قائمة الأحلام
// ===========================
function renderDreamsList() {
    if (!dreamsListEl) return;

    dreamsListEl.innerHTML = "";

    if (dreamsCache.length === 0) {
        dreamsListEl.innerHTML = "<p>لا توجد أحلام بعد</p>";
        return;
    }

    dreamsCache.forEach(dream => {
        const el = document.createElement("div");
        el.classList.add("dream-item");

        el.innerHTML = `
            <h3>${dream.title || "حلم بدون عنوان"}</h3>
            <p>${dream.description || ""}</p>
            <button data-id="${dream.id}">عرض</button>
        `;

        el.querySelector("button").addEventListener("click", () => {
            selectDream(dream.id);
        });

        dreamsListEl.appendChild(el);
    });
}

// ===========================
// 🔹 اختيار حلم
// ===========================
export function selectDream(dreamId) {
    currentDream = dreamsCache.find(d => d.id === dreamId);

    if (!currentDream) {
        setStatus("❌ لم يتم العثور على الحلم");
        return;
    }

    setStatus(`🌙 تحميل الحلم: ${currentDream.title}`);

    // إرسال الحلم لمحرك Dream Engine
    if (window.dreamEngineInstance) {
        window.dreamEngineInstance.loadDream(currentDream);
    }
}

// ===========================
// 🔹 إنشاء حلم جديد
// ===========================
export async function createDream(dreamData) {
    try {
        const result = await DreamsAPI.submitDream(dreamData);

        if (result && !result.error) {
            setStatus("✅ تم إنشاء الحلم");
            await loadDreams();
        } else {
            setStatus(result.message || "❌ فشل إنشاء الحلم");
        }
    } catch (err) {
        console.error(err);
        setStatus("❌ خطأ أثناء الإنشاء");
    }
}

// ===========================
// 🔹 تحديث الحلم الحالي (تفاعل)
// ===========================
export function updateDreamState(update) {
    if (!currentDream) return;

    currentDream.state = {
        ...currentDream.state,
        ...update
    };

    // إرسال التحديث لمحرك Three.js
    if (window.dreamEngineInstance) {
        window.dreamEngineInstance.updateState(currentDream.state);
    }
}

// ===========================
// 🔹 مزامنة مستمرة مع Backend
// ===========================
export async function syncDream() {
    if (!currentDream) return;

    try {
        await DreamsAPI.submitDream({
            id: currentDream.id,
            state: currentDream.state
        });
    } catch (err) {
        console.error("Sync Error:", err);
    }
}

// ===========================
// 🔹 حالة النظام
// ===========================
function setStatus(msg) {
    if (dreamStatusEl) {
        dreamStatusEl.textContent = msg;
    }
}

// ===========================
// 🔹 تشغيل تلقائي
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    loadDreams();

    // مزامنة كل 5 ثواني
    setInterval(syncDream, 5000);
});
