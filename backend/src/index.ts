import { WebSocketServer,WebSocket } from "ws";

const wss =  new WebSocketServer({port: 8080});

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on("connection",function connection(ws){
    ws.on('error',console.error);
    ws.on("message", function message(data:any){
        const message = JSON.parse(data);
        // console.log(message);
        if(message.type === "sender")
        {
          console.log("Sender set");
          senderSocket = ws;
        }else if(message.type === "receiver")
        {
            console.log("receiver set")
            receiverSocket = ws;
        }else if(message.type === "createOffer"){
            if(ws !== senderSocket)
                return;

            console.log("offer received")
            receiverSocket?.send(JSON.stringify({type:"offer",offer:message.sdp}))
        }else if(message.type === "createAnswer"){
            if(ws !== receiverSocket)
                 return;

            console.log("Answer received")
            senderSocket?.send(JSON.stringify({type:"answer",answer:message.answer}))
        }else if(message.type === "ice-candidate"){
            if(ws === senderSocket){
                receiverSocket?.send(JSON.stringify({type:"ice-candidate",candidate:message.candidate}))
             }else{
                senderSocket?.send(JSON.stringify({type:"ice-candidate",candidate:message.candidate}))
             }
        }
    });

    ws.send("Hello! I am a server!")
})