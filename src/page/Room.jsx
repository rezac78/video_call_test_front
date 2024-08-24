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

  useEffect(() => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        console.log(
          "Audio track is present in the main stream and active:",
          audioTracks[0].enabled
        );
      } else {
        console.log("No audio track available in the main stream");
      }
    }
  }, [stream]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#202124] relative">
      <SoundTest />
      <div
        className={`grid grid-cols-1 ${
          Object.keys(peers).length === 0 ? "lg:grid-cols-2" : "lg:grid-cols-4"
        }  gap-4 flex-1 p-4`}
      >
        <div className="col-span-1 lg:col-span-3 flex justify-center items-center">
          <div className="">
            <VideoPlayer stream={stream} />
          </div>
        </div>
        <div className="col-span-1 flex flex-col space-y-4">
          {Object.values(peers).map((peer, i) => (
            <div key={i} className="w-full">
              <VideoPlayer stream={peer.stream} />
            </div>
          ))}
        </div>
      </div>
      <SideBar openModal={isSidebarOpen} handleButton={toggleSidebar} />
      <Footer handleButton={toggleSidebar} IdUsers={id} />
    </div>
  );
};