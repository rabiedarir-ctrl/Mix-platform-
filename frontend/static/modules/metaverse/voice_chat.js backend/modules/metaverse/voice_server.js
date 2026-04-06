// ===========================
// 🔹 Voice Chat Client
// ===========================
export default class VoiceChat {
    constructor(player, serverUrl) {
        this.player = player;
        this.serverUrl = serverUrl;
        this.socket = null;
        this.stream = null;
    }

    async init() {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.socket = new WebSocket(this.serverUrl);

        this.socket.onopen = () => console.log("🎤 VoiceChat Connected");
        this.socket.onmessage = (msg) => this.handleIncoming(msg);
    }

    handleIncoming(msg) {
        const data = JSON.parse(msg.data);
        if (data.type === "voice") {
            const audio = new Audio(data.url);
            audio.play();
        }
    }

    sendVoice(blobUrl) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
        this.socket.send(JSON.stringify({ type: "voice", url: blobUrl }));
    }

    stop() {
        this.stream.getTracks().forEach(track => track.stop());
        if (this.socket) this.socket.close();
    }
                                         }
