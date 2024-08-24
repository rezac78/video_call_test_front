import { PhoneIcon } from "../../../public/Phone";
import { ChatIcon } from "../../../public/ChatIcon";
import MicOnIcon from "../../../public/MicOn";
import MicOffIcon from "../../../public/MicOff";
import useCurrentTime from "../../utils/useCurrentTime";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { RoomContext } from "../../context/RoomContext";
import ScreenIcon from "../../../public/Screen";

function Footer({ handleButton, IdUsers }) {
  const time = useCurrentTime();
  const { ws, stream, shareScreen, screenSharingId } = useContext(RoomContext);
  const [isMicOn, setIsMicOn] = useState(true);

  const handleEndCall = () => {
    console.log("End Call Button Clicked, Request ID:", IdUsers);
    ws.emit("delete-call-request", IdUsers);
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };
  console.log({ screenSharingId });
  return (
    <div>
      <footer className="bg-[#202124] text-white flex flex-col sm:flex-row justify-between items-center p-4">
        <div className="text-left mb-4 sm:mb-0 flex-1">
          <p>
            {time} | {IdUsers}
          </p>
        </div>
        <div className="flex justify-center gap-x-3 flex-1 mb-4 sm:mb-0">
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
        <div className="flex space-x-2 flex-1 justify-end">
          <button className="px-4 py-2" onClick={handleButton}>
            <ChatIcon />
          </button>
        </div>
      </footer>
    </div>
  );
}

Footer.propTypes = {
  IdUsers: PropTypes.string.isRequired,
  handleButton: PropTypes.func.isRequired,
};

export default Footer;
