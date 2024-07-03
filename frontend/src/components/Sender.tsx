import { useEffect, useState } from "react"

export default function Sender(){
     
    const [socket,setSocket] = useState<WebSocket|null>(null);

     useEffect(() => {
      const socket = new WebSocket("ws://localhost:8080");
      socket.onopen = function(){
        socket.send(JSON.stringify({type: "sender"}))
      }    
     
      setSocket(socket)
     },[])
    

    async function startVideoSending(){
        if(!socket)
              return;

        const pc = new RTCPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket?.send(JSON.stringify({type:"createOffer",sdp:pc.localDescription}))
        
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            if(message.type === "createAnswer"){
                pc.setRemoteDescription(message.sdp)
            }
        }
    
    } 
    
    return (<div>revec
        <button onClick={startVideoSending}>Send Video</button>
    </div>)
}