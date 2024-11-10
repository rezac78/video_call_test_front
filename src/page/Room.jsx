import { useParams, useLocation } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { useContext, useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import Footer from "../components/footer";
import { VideoPlayer } from "../components/VideoPlayer";
import { SoundTest } from "../components/soundTest";
import Modal from "../components/modal";

export const Room = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [microphone, setMicrophone] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    ws,
    me,
    stream,
    peers,
    screenSharingId,
    setRoomId,
    isModalOpen,
    setIsModalOpen,
  } = useContext(RoomContext);
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    ws.on("error", (message) => {
      console.log("Error received from server:", message);
      setErrorMessage(message);
    });
    return () => {
      ws.off("error");
    };
  }, [ws]);

  useEffect(() => {
    console.log("Requesting call requests...");
    ws.emit("get-call-requests", (data) => {
      console.log("Call requests data:", data);
      setUserName(data);
    });
    if (me) {
      console.log("Joining room:", id, "with peerId:", me.id);
      ws.emit("join-room", { roomId: id, peerId: me.id });
    }
    setRoomId(id);
  }, [id, me, ws, setRoomId]);

  const toggleSidebar = () => {
    console.log("Toggling sidebar. Is open:", !isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };
  const screenSharingVideo =
    screenSharingId === me?.id ? stream : peers[screenSharingId]?.stream;
  const { [screenSharingId]: sharing, ...peersToShow } = peers;

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202124] text-white">
        <h1 className="text-2xl">{errorMessage}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#202124] relative">
      <Modal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        title="دسترسی رد شد"
        message="مرورگر شما اجازه دسترسی به میکروفون و دوربین را ندارد بررسی کنید"
      />
      <SoundTest microphone={microphone} />
      <div className="flex justify-center gap-6 my-6">
        {screenSharingVideo && (
          <div className="w-3/5 pr-4">
            <VideoPlayer stream={screenSharingVideo} />
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center flex-grow gap-6 my-6">
        <div className="">
          {screenSharingId !== me?.id && <VideoPlayer stream={stream} />}
        </div>
        {Object.values(peersToShow).map(
          (peer, i) =>
            peer.stream.id !== stream.id && (
              <div className="" key={i}>
                <VideoPlayer stream={peer.stream} />
              </div>
            )
        )}
      </div>
      <SideBar
        userName={userName[0]?.name || ""}
        admin={state}
        openModal={isSidebarOpen}
        handleButton={toggleSidebar}
      />
      <Footer
        microphone={microphone}
        setMicrophone={setMicrophone}
        handleButton={toggleSidebar}
        IdUsers={id}
      />
    </div>
  );
};