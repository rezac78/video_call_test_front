import { createContext, useEffect, useState, useReducer } from "react";
import socketIO from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peersReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";
import { SOCKET_URL } from "../config-global";

const WS = SOCKET_URL;
export const RoomContext = createContext(null);

const ws = socketIO(WS);

export const RoomProvider = ({ children }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [stream, setStream] = useState(null);
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [screenSharingId, setScreenSharingId] = useState("");
  const [roomId, setRoomId] = useState("");

  const enterRoom = ({ roomId }) => {
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({ participants }) => {
    console.log({ participants });
  };

  const removePeer = (peerId) => {
    dispatch(removePeerAction(peerId));
  };

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId.substring(0, 12));

    peer.on("open", (id) => {
      console.log("PeerJS connection established with ID:", id);
      setMe(peer);
    });

    peer.on("error", (err) => {
      console.log("PeerJS connection error:", err);
    });

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.log("Error accessing media devices:", error);
    }

    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
    ws.on("user-started-screen", (peerId) => setScreenSharingId(peerId));
    ws.on("user-stopped-screen", () => setScreenSharingId(""));
    return () => {
      ws.off("room-created");
      ws.off("get-users");
      ws.off("user-disconnected");
      ws.off("user-started-screen");
      ws.off("user-stopped-screen");
      ws.off("user-joined");
    };
  }, []);

  const switchStream = (stream) => {
    setStream(stream);
    setScreenSharingId(me?.id || "");
    Object.values(me?.connections).forEach((connection) => {
      const videoTrack = stream
        ?.getTracks()
        .find((track) => track.kind === "video");
      connection[0].peerConnection
        .getSenders()[1]
        .replaceTrack(videoTrack)
        .catch((err) => console.error(err));
    });
  };

  const shareScreen = () => {
    if (screenSharingId) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(switchStream);
    } else {
      navigator.mediaDevices.getDisplayMedia({}).then(switchStream);
    }
  };
  const sendMessage = (message) => {
    const messageData = {
      content: message,
      timestamp: new Date().getTime(),
      author: me?.id,
    };
    ws.emit("send-message", roomId, messageData);
  };
  useEffect(() => {
    if (screenSharingId) {
      ws.emit("start-sharing", { peerId: screenSharingId, roomId });
    } else {
      ws.emit("stop-sharing");
    }
  }, [screenSharingId, roomId]);
  useEffect(() => {
    if (!me || !stream) {
      console.log("Peer or stream is not ready");
      return;
    }

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

    return () => {
      ws.off("user-joined");
      me.off("call");
    };
  }, [me, stream]);

  return (
    <RoomContext.Provider
      value={{
        ws,
        me,
        stream,
        peers,
        shareScreen,
        screenSharingId,
        setRoomId,
        sendMessage,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
