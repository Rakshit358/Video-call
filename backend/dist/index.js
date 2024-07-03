"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on("connection", function connection(ws) {
    ws.on('error', console.error);
    ws.on("message", function message(data) {
        const message = JSON.parse(data);
        // console.log(message);
        if (message.type === "sender") {
            console.log("Sender set");
            senderSocket = ws;
        }
        else if (message.type === "receiver") {
            console.log("receiver set");
            receiverSocket = ws;
        }
        else if (message.type === "createOffer") {
            if (ws !== senderSocket)
                return;
            console.log("offer received");
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "offer", offer: message.sdp }));
        }
        else if (message.type === "createAnswer") {
            if (ws !== receiverSocket)
                return;
            console.log("Answer received");
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "answer", answer: message.answer }));
        }
        else if (message.type === "ice-candidate") {
            if (ws === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "ice-candidate", candidate: message.candidate }));
            }
            else {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "ice-candidate", candidate: message.candidate }));
            }
        }
    });
    ws.send("Hello! I am a server!");
});
