import { useEffect, useRef } from "react";

export const VideoPlayer = ({ stream, className }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);
  return <video className={className} ref={videoRef} autoPlay playsInline />;
};
