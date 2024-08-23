import { useParams } from "react-router-dom"
import { RoomContext } from "../context/RoomContext";
import { useContext, useEffect } from "react";
import { VideoPlayer } from "../components/VideoPlayer";
export const Room = () => {
        const { id } = useParams();
        const { ws, me, stream, peers } = useContext(RoomContext)
        useEffect(() => {
                if (me) ws.emit("join-room", { roomId: id, peerId: me._id })
        }, [id, me, ws])
        return (
                <div className="grid grid-cols-4 gap-4">
                        <VideoPlayer stream={stream} />
                        {Object.values(peers).map((peer, i) => (
                                <VideoPlayer key={i} stream={peer.stream} />
                        ))}
                </div>
        )
}