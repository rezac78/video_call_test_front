import { createContext, useEffect, useState, useReducer } from "react";
import PropTypes from "prop-types";
import socketIO from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { peersReducer } from "../reducers/peerReducer";
import { SOCKET_URL } from "../config-global";
import { chatReducer } from "../reducers/chatReducer";
import { addPeerAction, removePeerAction } from "../reducers/peerActions";
import { addHistoryAction, addMessageAction } from "../reducers/chatActions";

const WS = SOCKET_URL;
export const RoomContext = createContext(null);

const ws = socketIO(WS);

export const RoomProvider = ({ children }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );
  const [screenSharingId, setScreenSharingId] = useState("");
  const [roomId, setRoomId] = useState("");

  const enterRoom = ({ roomId }) => {
    console.log("Entering room:", roomId);
    navigate(`/room/${roomId}`);
  };
  const getUsers = ({ participants }) => {
    console.log({ participants });
  };

  const removePeer = (peerId) => {
    console.log("Removing peer with id:", peerId);
    dispatch(removePeerAction(peerId));
  };
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("authToken"));
      console.log("Auth state changed, isAuthenticated:", isAuthenticated);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  useEffect(() => {
    const getMedia = async () => {
      try {
        console.log("Attempting to access media devices...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Media stream acquired:", mediaStream);
        setStream(mediaStream);
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setIsModalOpen(true);
      }
    };

    getMedia();
  }, []);
  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId.substring(0, 12));

    peer.on("open", () => {
      console.log("Peer opened with ID:", meId);
      setMe(peer);
    });

    peer.on("error", (err) => {
      console.log("PeerJS connection error:", err);
    });

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log("User media stream:", stream);
          setStream(stream);
        });
    } catch (error) {
      console.log("Error accessing media devices:", error);
    }

    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
    ws.on("user-started-screen", (peerId) => {
      console.log("User started screen sharing:", peerId);
      setScreenSharingId(peerId);
    });
    ws.on("user-stopped-screen", () => setScreenSharingId(""));
    ws.on("add-message", addMessage);
    ws.on("get-messages", addHistory);
    return () => {
      ws.off("room-created");
      ws.off("get-users");
      ws.off("user-disconnected");
      ws.off("user-started-screen");
      ws.off("user-stopped-screen");
      ws.off("user-joined");
      ws.off("add-message");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchStream = (stream) => {
    console.log("Switching stream:", stream);
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
    chatDispatch(addMessageAction(messageData));
    ws.emit("send-message", roomId, messageData);
  };
  const addMessage = (message) => {
    chatDispatch(addMessageAction(message));
  };
  const addHistory = (messages) => {
    chatDispatch(addHistoryAction(messages));
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
      return;
    }

    ws.on("user-joined", ({ peerId }) => {
      const call = me.call(peerId, stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream));
      });
    });

    me.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
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
        setStream,
        sendMessage,
        chat,
        isModalOpen,
        setIsModalOpen,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
RoomProvider.propTypes = {
  children: PropTypes.node.isRequired,
};