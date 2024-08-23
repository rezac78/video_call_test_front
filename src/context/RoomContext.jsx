import { createContext, useEffect, useState, useReducer } from "react"
import socketIO from "socket.io-client"
import { useNavigate } from "react-router-dom"
import Peer from "peerjs"
import { v4 as uuidV4 } from "uuid"
import { peersReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions"
const WS = "http://localhost:4000"
export const RoomContext = createContext(null)

const ws = socketIO(WS)

export const RoomProvider = ({ children }) => {
        const navigate = useNavigate();
        const [me, setMe] = useState();
        const [stream, setStream] = useState();
        const [peers, dispatch] = useReducer(peersReducer, {});
        const enterRoom = ({ roomId }) => {
                navigate(`/room/${roomId}`)
        }
        const getUsers = ({ participants }) => {
                console.log({ participants })
        }
        const removePeer = (peerId) => {
                dispatch(removePeerAction(peerId))
        }
        useEffect(() => {
                const meId = uuidV4();
                const peer = new Peer(meId);

                peer.on("open", (id) => {
                        console.log("PeerJS connection established with ID:", id);
                        setMe(peer);
                });

                peer.on("error", (err) => {
                        console.log("PeerJS connection error:", err);
                });

                try {
                        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                                setStream(stream);
                        });
                } catch (error) {
                        console.log("Error accessing media devices:", error);
                }

                ws.on("room-created", enterRoom);
                ws.on("get-users", getUsers);
                ws.on("user-disconnected", removePeer);
        }, []);

        useEffect(() => {
                if (!me) {
                        console.log("Peer is not set yet");
                        return;
                }
                if (!stream) {
                        console.log("Stream is not set yet");
                        return;
                }
                console.log("Peer and stream are ready");

                ws.on("user-joined", ({ peerId }) => {
                        console.log("User joined with peerId:", peerId);
                        const call = me.call(peerId, stream);
                        call.on("stream", (peerStream) => {
                                console.log("Received stream from peer:", peerId);
                                dispatch(addPeerAction(peerId, peerStream));
                        });
                });

                me.on("call", (call) => {
                        console.log("Incoming call from peer:", call.peer);
                        call.answer(stream);
                        call.on("stream", (peerStream) => {
                                console.log("Received stream from answered call:", call.peer);
                                dispatch(addPeerAction(call.peer, peerStream));
                        });
                });
        }, [me, stream]);

        console.log({ peers })
        return (
                <RoomContext.Provider value={{ ws, me, stream, peers }}>
                        {children}
                </RoomContext.Provider>
        );
}


