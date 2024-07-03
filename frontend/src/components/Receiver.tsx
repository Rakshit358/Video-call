import { useEffect } from "react"

export default function Receiver(){
    
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        socket.onopen = () => {
            socket.send(JSON.stringify({type:"receiver"}))
        }
         
        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            console.log(data)
            if(data.type === "offer"){
              console.log("HEre")
              const pc = new RTCPeerConnection();
            //   console.log(data.sdp)
              await pc.setRemoteDescription(data.offer);
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              socket?.send(JSON.stringify({type:"createAnswer",sdp:pc.localDescription}))
            }
        }

    },[])
   

    return <div>Receiver</div>
}