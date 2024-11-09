import { useContext, useEffect, useState } from "react";
import { RoomContext } from "../../context/RoomContext";
import PropTypes from "prop-types";
import { PhoneIcon } from "../../../public/Phone";
import { ChatIcon } from "../../../public/ChatIcon";
import MicOnIcon from "../../../public/MicOn";
import MicOffIcon from "../../../public/MicOff";
import ScreenIcon from "../../../public/Screen";
import Screen from "../../../public/ScreenIcon";
import ScreenOffIcon from "../../../public/ScreenOffIcon";
import useCurrentTime from "../../utils/useCurrentTime";

function Footer({ handleButton, IdUsers, setMicrophone, microphone }) {
  const time = useCurrentTime();
  const { ws, shareScreen, stream, me, roomId } = useContext(RoomContext);
  const [camera, setCamera] = useState(true);
  const [screen, setScreen] = useState(true);
  const handleEndCall = () => {
    ws.emit("delete-call-request", IdUsers);
    window.location.href = `https://hamrahanefarda.com/login?info=${btoa(
      encodeURIComponent(
        JSON.stringify({
          token: localStorage.getItem("authToken"),
        })
      )
    )}`;
  };
  const toggleMicrophone = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
        console.log(
          `Microphone is now ${track.enabled ? "enabled" : "disabled"}`
        );
      });
    }
    setMicrophone(!microphone);
    console.log(`Microphone state is now ${!microphone}`);
  };

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setCamera(!camera);
  };
  useEffect(() => {
    if (me) {
      ws.emit("update-microphone-status", {
        peerId: me.id,
        microphoneStatus: microphone,
        roomId,
      });
      ws.emit("update-camera-status", {
        peerId: me.id,
        cameraStatus: camera,
        roomId,
      });
    }
  }, [microphone, camera, me, ws, roomId]);

  return (
    <div className="relative my-10">
      <footer className="bg-[#202124] text-white fixed bottom-0 left-0 w-full flex flex-col sm:flex-row justify-between p-4">
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
            className={`px-2 py-2 rounded-full ${
              microphone ? "bg-[#363637]" : "bg-[#EA4335]"
            } `}
            onClick={toggleMicrophone}
          >
            {microphone ? <MicOnIcon /> : <MicOffIcon />}
          </button>
          <button
            className={`px-2 py-2 rounded-full  ${
              camera ? "bg-[#363637]" : "bg-[#EA4335]"
            }`}
            onClick={toggleCamera}
          >
            {camera ? <Screen /> : <ScreenOffIcon />}
          </button>
          <button
            className={`px-2 py-2 rounded-full ${
              screen ? "bg-[#363637]" : "bg-[#8AB4F8]"
            }`}
            onClick={() => {
              shareScreen(), setScreen(!screen);
            }}
          >
            <ScreenIcon />
          </button>
          <button
            className="px-4 py-2 rounded-full bg-[#EA4335]"
            onClick={handleEndCall}
          >
            <PhoneIcon />
          </button>
        </div>
        <div className="hidden sm:flex space-x-2 flex-1 justify-end">
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
  microphone: PropTypes.bool.isRequired,
  handleButton: PropTypes.func.isRequired,
  setMicrophone: PropTypes.func.isRequired,
};

export default Footer;
