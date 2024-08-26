import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { useContext, useEffect, useState } from "react";
import SideBar from "../components/sideBar";
import Footer from "../components/footer";
import { VideoPlayer } from "../components/VideoPlayer";
import { SoundTest } from "../components/soundTest";

export const Room = () => {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { ws, me, stream, peers } = useContext(RoomContext);

  useEffect(() => {
    if (me) {
      ws.emit("join-room", { roomId: id, peerId: me._id });
    }
  }, [id, me, ws]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#202124] relative">
      <SoundTest />
      <div className={`flex flex-grow justify-center flex-wrap gap-6 mt-5`}>
        <div className="">
          <VideoPlayer stream={stream} />
        </div>
        {Object.values(peers).map((peer, i) => (
          <div key={i} className="bg-red-200">
            <VideoPlayer stream={peer.stream} />
          </div>
        ))}
      </div>
      <SideBar openModal={isSidebarOpen} handleButton={toggleSidebar} />
      <Footer handleButton={toggleSidebar} IdUsers={id} />
    </div>
  );
};
