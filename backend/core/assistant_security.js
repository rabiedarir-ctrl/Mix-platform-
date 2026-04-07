/**
 * Mix Platform - AI Security Assistant
 * المساعد الذكي للأمن والسلامة والطاقة
 * يراقب المستخدم، العوالم، الطاقة، ويساعد في الحفاظ على السلامة
 */

const SecurityAssistant = (() => {

    // ===========================
    // 🔹 الحالة الداخلية
    // ===========================
    const state = {
        name: "MixAI-Security",
        active: false,
        energyThreshold: 0.2,       // الحد الأدنى للطاقة
        notifications: [],
        userContext: {},            // بيانات المستخدم الحالية
        taskQueue: [],
        alerts: [],                 // قائمة الإنذارات الأمنية
        monitoredZones: [],         // المناطق أو العوالم المراقبة
        securityRules: []           // قواعد الأمن والسلامة
    };

    // ===========================
    // 🔹 تفعيل المساعد
    // ===========================
    function init(config = {}) {
        state.active = true;
        if(config.name) state.name = config.name;
        if(config.energyThreshold) state.energyThreshold = config.energyThreshold;
        if(config.monitoredZones) state.monitoredZones = config.monitoredZones;
        if(config.securityRules) state.securityRules = config.securityRules;

        Helpers.log(`${state.name} initialized and monitoring started.`, "info");

        // بدء المراقبة الدورية للطاقة والأمن
        monitorEnergy();
        monitorSecurity();
    }

    // ===========================
    // 🔹 مراقبة الطاقة تلقائيًا
    // ===========================
    function monitorEnergy() {
        if(!state.active) return;

        setInterval(() => {
            const sensoryState = Sensory.getCurrentState();
            const totalEnergy = calculateEnergy(sensoryState);

            if(totalEnergy < state.energyThreshold) {
                notify(`⚠️ طاقتك منخفضة: ${totalEnergy.toFixed(2)}`);
                autoRecharge();
            }

        }, 1000); // كل ثانية
    }

    // ===========================
    // 🔹 مراقبة الأمن والسلامة
    // ===========================
    function monitorSecurity() {
        if(!state.active) return;

        setInterval(() => {
            // مثال: التحقق من مناطق العوالم
            state.monitoredZones.forEach(zone => {
                if(World.isIntruder(zone)) {
                    triggerAlert(`🚨 تهديد محتمل في ${zone}`);
                    // يمكن تفعيل إجراءات أمان تلقائية
                    World.lockZone(zone);
                    World.notifyUsers(zone, "يرجى الحذر، المنطقة تحت المراقبة الأمنية.");
                }
            });

            // مراقبة المستخدم أو سلوك النظام
            const user = state.userContext;
            if(user && user.behaviorSuspicious) {
                triggerAlert("⚠️ سلوك مريب للمستخدم");
            }

        }, 1500); // كل 1.5 ثانية
    }

    // ===========================
    // 🔹 حساب الطاقة الإجمالية
    // ===========================
    function calculateEnergy(sensoryState) {
        const brainFocus = sensoryState.brainSignals.focusLevel || 0;
        const lightIntensity = sensoryState.lightStack.intensity || 0;
        const emotionScore = sensoryState.brainSignals.emotion?.calmness || 0;

        return brainFocus * 0.6 + lightIntensity * 0.3 + emotionScore * 0.1;
    }

    // ===========================
    // 🔹 إشعارات
    // ===========================
    function notify(message) {
        state.notifications.push({ message, timestamp: Date.now() });
        console.log(`[${state.name} Notification]: ${message}`);
        if(typeof UI !== "undefined" && UI.showNotification) {
            UI.showNotification(message);
        }
    }

    function triggerAlert(message) {
        state.alerts.push({ message, timestamp: Date.now() });
        console.warn(`[${state.name} ALERT]: ${message}`);
        notify(message);
    }

    // ===========================
    // 🔹 مهام تلقائية
    // ===========================
    function autoRecharge() {
        World.adjustLighting(0.8);   // رفع الإضاءة
        World.triggerEffect("calm"); // مؤثر هادئ
        notify("تم تفعيل إجراءات تحسين الطاقة تلقائيًا.");
    }

    function queueTask(taskFn) {
        if(typeof taskFn === "function") {
            state.taskQueue.push(taskFn);
            executeTasks();
        }
    }

    function executeTasks() {
        while(state.taskQueue.length > 0) {
            const task = state.taskQueue.shift();
            try { task(); }
            catch(e) { console.error(e); }
        }
    }

    // ===========================
    // 🔹 تحديث سياق المستخدم
    // ===========================
    function updateUserContext(data) {
        state.userContext = { ...state.userContext, ...data };
    }

    // ===========================
    // 🔹 إدارة قواعد الأمن والسلامة
    // ===========================
    function addSecurityRule(ruleFn) {
        if(typeof ruleFn === "function") {
            state.securityRules.push(ruleFn);
        }
    }

    function executeSecurityRules() {
        state.securityRules.forEach(rule => {
            try { rule(state); }
            catch(e){ console.error(e); }
        });
    }

    // ===========================
    // 🔹 تشغيل / إيقاف المساعد
    // ===========================
    function activate() { state.active = true; }
    function deactivate() { state.active = false; }

    // ===========================
    // 🔹 واجهة التصدير
    // ===========================
    return {
        init,
        activate,
        deactivate,
        notify,
        triggerAlert,
        queueTask,
        updateUserContext,
        addSecurityRule,
        executeSecurityRules,
        getState: () => ({ ...state })
    };

})();
