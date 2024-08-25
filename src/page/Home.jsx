import { useContext, useState } from "react";
import { RoomContext } from "../context/RoomContext";
import Modal from "../components/modal";
import { VideoPlayer } from "../components/VideoPlayer";

export const Home = () => {
  const { ws, stream } = useContext(RoomContext);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const createRoom = () => {
    setIsModalOpen(false);
    ws.emit("create-room", { name, phoneNumber });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
      <Modal
        setName={setName}
        isModalOpen={isModalOpen}
        setPhoneNumber={setPhoneNumber}
        handleConnect={createRoom}
        phoneNumber={phoneNumber}
        name={name}
      />
     <div className="">
        <VideoPlayer stream={stream} className="absolute top-5 left-0 w-full h-[90%]" />
      </div>
    </div>
  );
};