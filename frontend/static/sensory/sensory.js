/**
 * Mix Platform - Sensory & Master Engine
 * نظام التواصل الاستشعاري والحسي
 * يتعامل مع إشارات الدماغ و الكومة الضوئية للجسد
 * مرتبط بمحرك العالم Dashboard و World تلقائيًا
 */

import { World } from './world.js';
import { Dashboard } from './dashboard.js';

const Sensory = (() => {

    // ===========================
    // 🔹 الحالة الداخلية
    // ===========================
    const state = {
        brainSignals: {const brainSignalsSample = {
    focusLevel: 0.75,        // تركيز المستخدم: 0.0 إلى 1.0
    relaxationLevel: 0.45,   // حالة الاسترخاء: 0.0 إلى 1.0
    alertness: 0.6,          // اليقظة: 0.0 إلى 1.0
    mentalFatigue: 0.2,      // التعب العقلي: 0.0 إلى 1.0
    emotion: {               // شعور المستخدم الحالي
        happiness: 0.5,
        sadness: 0.1,
        anxiety: 0.2,
        calmness: 0.7
    },
    attentionPoints: [       // نقاط الانتباه (مكانية في المشهد)
        { x: 0.3, y: 0.6, intensity: 0.8 },
        { x: 0.7, y: 0.2, intensity: 0.4 }
    ],
    timestamp: Date.now()
};},     // بيانات إشارات الدماغ الحالية
        lightStack: {const lightStackSample = {
    intensity: 0.8,           // قوة الضوء العام
    color: { r: 255, g: 200, b: 100 }, // لون الضوء الحالي
    pulsation: 0.3,           // نبض الضوء
    timestamp: Date.now()
};

        // إرسال الكومة الضوئية إلى Sensory
        Sensory.updateLightStack(lightStackSample);},       // الكومة الضوئية الحالية للجسد
        listeners: [],        // مستمعو التغيرات
        connected: false
    };

    // ===========================
    // 🔹 التوصيل وتهيئة النظام
    // ===========================
    function init(config = {}) {
        state.connected = true;
        console.log("Sensory system initialized.");

        if(config.brainSource) connectBrainSource(config.brainSource);
        if(config.lightStackSource) connectLightStack(config.lightStackSource);
    }

    // ===========================
    // 🔹 الاتصال بمصدر إشارات الدماغ
    // ===========================
    function connectBrainSource(source) {
        state.brainSource = source;
        console.log("Brain source connected.");
    }

    // ===========================
    // 🔹 الاتصال بالكومة الضوئية
    // ===========================
    function connectLightStack(source) {
        state.lightStackSource = source;
        console.log("Light Stack source connected.");
    }

    // ===========================
    // 🔹 تحديث البيانات في الوقت الحقيقي
    // ===========================
    function updateBrainSignals(data) {
        state.brainSignals = { ...state.brainSignals, ...data };
        notifyListeners("brainSignals", state.brainSignals);

        // تحديث الطاقة مباشرة في World
        World.updateEnergyFromBrain(state.brainSignals);
        Dashboard.update();
    }

    function updateLightStack(data) {
        state.lightStack = { ...state.lightStack, ...data };
        notifyListeners("lightStack", state.lightStack);

        // تحديث التأثيرات الضوئية مباشرة في World
        World.updateLightEffects(state.lightStack);
        Dashboard.update();
    }

    // ===========================
    // 🔹 الاشتراكات للتغيرات
    // ===========================
    function onChange(callback) {
        if(typeof callback === "function") state.listeners.push(callback);
    }

    function notifyListeners(type, payload) {
        state.listeners.forEach(cb => {
            try { cb(type, payload); }
            catch(e){ console.error(e); }
        });
    }

    // ===========================
    // 🔹 واجهة قياس الطاقة والحالة
    // ===========================
    function getCurrentState() {
        return {
            brainSignals: state.brainSignals,
            lightStack: state.lightStack,
            connected: state.connected
        };
    }

    function isConnected() { return state.connected; }

    // ===========================
    // 🔹 تصدير الوظائف
    // ===========================
    return {
        init,
        updateBrainSignals,
        updateLightStack,
        onChange,
        getCurrentState,
        isConnected
    };

})();
