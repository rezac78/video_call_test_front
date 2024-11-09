import { useEffect, useRef } from "react";

export const VideoPlayer = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video className="w-full h-full" ref={videoRef} autoPlay playsInline muted />
  );
};
