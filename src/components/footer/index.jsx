import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // اضافه کردن useNavigate
import { RoomContext } from "../../context/RoomContext";
import PropTypes from "prop-types";
import { PhoneIcon } from "../../../public/Phone";
import { ChatIcon } from "../../../public/ChatIcon";
import MicOnIcon from "../../../public/MicOn";
import MicOffIcon from "../../../public/MicOff";
import ScreenIcon from "../../../public/Screen";
import useCurrentTime from "../../utils/useCurrentTime";

function Footer({ handleButton, IdUsers }) {
  const navigate = useNavigate(); // استفاده از useNavigate
  const time = useCurrentTime();
  const { ws, stream, shareScreen } = useContext(RoomContext);
  const [isMicOn, setIsMicOn] = useState(true);

  const handleEndCall = () => {
    ws.emit("delete-call-request", IdUsers);
    navigate('/');
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);

        if (!audioTrack.enabled) {
          stream.getAudioTracks().forEach((track) => track.stop());
        } else {
          navigator.mediaDevices.getUserMedia({ audio: true }).then((newStream) => {
            const newAudioTrack = newStream.getAudioTracks()[0];
            stream.addTrack(newAudioTrack);
          });
        }
      }
    }
  };

  return (
      <footer className="relative w-full bg-[#202124]  text-white flex flex-col sm:flex-row justify-between p-4">
        <div className="flex justify-between items-center w-full sm:w-auto mb-4 sm:mb-0">
          <div className="text-left flex-1">
            <p>
              {time} | {IdUsers}
            </p>
          </div>
          <div className="flex-1 flex justify-end sm:hidden">
            <button className="px-4 py-2" onClick={handleButton}>
              <ChatIcon />
            </button>
          </div>
        </div>
        <div className="flex justify-center gap-x-3 mb-4 sm:mb-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
          <button
            className={`px-2 py-2 rounded-full bg-[#363637]`}
            onClick={toggleMic}
          >
            {isMicOn ? <MicOnIcon /> : <MicOffIcon />}
          </button>
          <button
            className="px-4 py-2 rounded-full bg-[#EA4335]"
            onClick={handleEndCall}
          >
            <PhoneIcon />
          </button>
          <button
            className="px-2 py-2 rounded-full bg-[#363637]"
            onClick={shareScreen}
          >
            <ScreenIcon />
          </button>
        </div>
        <div className="hidden sm:flex space-x-2 flex-1 justify-end">
          <button className="px-4 py-2" onClick={handleButton}>
            <ChatIcon />
          </button>
        </div>
      </footer>
  );
}

Footer.propTypes = {
  IdUsers: PropTypes.string.isRequired,
  handleButton: PropTypes.func.isRequired,
};

export default Footer;
