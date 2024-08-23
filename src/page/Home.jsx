import { useContext, useState } from 'react';
import { RoomContext } from '../context/RoomContext';
import Modal from "../components/modal";
import { VideoPlayer } from '../components/VideoPlayer';

export const Home = () => {
        const { ws, stream, me } = useContext(RoomContext);
        const [isModalOpen, setIsModalOpen] = useState(true);
        const [name, setName] = useState("");
        const [phoneNumber, setPhoneNumber] = useState("");
        console.log(me)
        const createRoom = () => {
                setIsModalOpen(false);
                ws.emit('create-room', { name, phoneNumber });
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

                        <div>
                                <VideoPlayer stream={stream} />
                        </div>
                </div>
        );
};
