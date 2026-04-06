// ===========================
// 🔹 Events System Client
// ===========================
import { sendEvent, on } from "../../matrix.js";

export default class EventsSystem {
    constructor(player, worldEngine) {
        this.player = player;
        this.worldEngine = worldEngine;
        this.activeEvents = new Map(); // eventId -> event object
    }

    addEvent(id, description, trigger, action) {
        this.activeEvents.set(id, {
            id,
            description,
            trigger,  // دالة تتحقق من شرط الحدث
            action,   // دالة تنفيذ الحدث
            executed: false
        });
    }

    update() {
        this.activeEvents.forEach(event => {
            if (!event.executed && event.trigger(this.player, this.worldEngine)) {
                event.action(this.player, this.worldEngine);
                event.executed = true;
                sendEvent("event_triggered", { eventId: event.id });
                console.log(`🌟 Event Triggered: ${event.description}`);
            }
        });
    }

    listEvents() {
        return Array.from(this.activeEvents.values());
    }
                  }
