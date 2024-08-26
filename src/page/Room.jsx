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
  const { ws, me, stream } = useContext(RoomContext);

  useEffect(() => {
    if (me) {
      ws.emit("join-room", { roomId: id, peerId: me._id });
    }
  }, [id, me, ws]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const peers = {
    "af5e9919-7cf": {
      stream: {},
    },
    "c63f6cc8-7af": {
      stream: {},
    },
    "8dc31733-169": {
      stream: {},
    },
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#202124]">
      <SoundTest />
      {/* <div className="flex-grow mx-auto h-full overflow-hidden bg-red-400 grid grid-cols-5 grid-rows-2 p-9 gap-6">
        <div className="w-full h-full col-span-3 row-span-2 bg-yellow-400 ">
          <VideoPlayer className={"w-full"} stream={stream} />
        </div>
        <div className="col-span-2 col-start-4 row-start-1 bg-blue-400 aspect-square">
          2
        </div>
        <div className="col-span-2 col-start-4 row-start-2 bg-pink-600 aspect-square">
          3
        </div>
      </div> */}

      <div className="">
        <div></div>
        <div></div>
        <div></div>
      </div>


      {/* <div
        className={`grid grid-cols-1 ${
          Object.keys(peers).length === 0 ? "lg:grid-cols-2" : "lg:grid-cols-4"
        }  gap-4 flex-1 p-4`}
      >
        <div className="col-span-1 lg:col-span-3 flex justify-center items-center">
          <div className="w-full md:w-4/5">
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
      </div> */}
      <SideBar openModal={isSidebarOpen} handleButton={toggleSidebar} />
      <Footer handleButton={toggleSidebar} IdUsers={id} />
    </div>
  );
};