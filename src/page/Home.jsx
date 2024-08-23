import { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';

export const Home = () => {
        const { ws } = useContext(RoomContext);

        const createRoom = () => {
                ws.emit('create-room');
        };

        return (
                <div>
                        <button onClick={createRoom}>Start new meeting</button>
                </div>
        );
};
