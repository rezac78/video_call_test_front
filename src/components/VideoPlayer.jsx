import { useEffect, useRef } from "react";

export const VideoPlayer = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      console.log("Setting video stream:", stream);
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video className="w-full h-full" ref={videoRef} autoPlay playsInline muted />
  );
};
