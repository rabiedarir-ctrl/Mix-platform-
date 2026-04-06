// ===========================
// 🔹 استيراد Matrix
// ===========================
import { sendEvent, on } from "../../matrix.js";

// ===========================
// 🔹 Voice Chat Manager
// ===========================
export default class VoiceChat {
    constructor() {
        this.localStream = null;
        this.peers = {}; // userId -> RTCPeerConnection
    }

    // ===========================
    // 🔹 تشغيل الميكروفون
    // ===========================
    async init() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });

            console.log("🎤 Microphone ready");

            this.setupListeners();

        } catch (err) {
            console.error("Microphone Error:", err);
        }
    }

    // ===========================
    // 🔹 إعداد استقبال الإشارات
    // ===========================
    setupListeners() {

        // استقبال Offer
        on("voice_offer", async ({ from, offer }) => {
            const peer = this.createPeer(from);

            await peer.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);

            sendEvent("voice_answer", {
                to: from,
                answer
            });
        });

        // استقبال Answer
        on("voice_answer", async ({ from, answer }) => {
            const peer = this.peers[from];
            if (!peer) return;

            await peer.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // استقبال ICE
        on("voice_ice", async ({ from, candidate }) => {
            const peer = this.peers[from];
            if (!peer) return;

            await peer.addIceCandidate(new RTCIceCandidate(candidate));
        });
    }

    // ===========================
    // 🔹 إنشاء اتصال مع لاعب
    // ===========================
    createPeer(userId) {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" }
            ]
        });

        // إرسال الصوت
        this.localStream.getTracks().forEach(track => {
            peer.addTrack(track, this.localStream);
        });

        // استقبال الصوت
        peer.ontrack = (event) => {
            this.playAudio(userId, event.streams[0]);
        };

        // ICE
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                sendEvent("voice_ice", {
                    to: userId,
                    candidate: event.candidate
                });
            }
        };

        this.peers[userId] = peer;
        return peer;
    }

    // ===========================
    // 🔹 بدء اتصال
    // ===========================
    async callUser(userId) {
        const peer = this.createPeer(userId);

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        sendEvent("voice_offer", {
            to: userId,
            offer
        });
    }

    // ===========================
    // 🔹 تشغيل الصوت
    // ===========================
    playAudio(userId, stream) {
        let audio = document.getElementById("audio_" + userId);

        if (!audio) {
            audio = document.createElement("audio");
            audio.id = "audio_" + userId;
            audio.autoplay = true;
            document.body.appendChild(audio);
        }

        audio.srcObject = stream;
    }

    // ===========================
    // 🔹 إنهاء الاتصال
    // ===========================
    removePeer(userId) {
        if (this.peers[userId]) {
            this.peers[userId].close();
            delete this.peers[userId];
        }

        const audio = document.getElementById("audio_" + userId);
        if (audio) audio.remove();
    }
              }
