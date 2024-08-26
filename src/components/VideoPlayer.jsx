import { useEffect, useRef } from "react";

export const VideoPlayer = ({ stream, className }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      className="h-full w-full rounded-lg"
      ref={videoRef}
      autoPlay
      playsInline
    />
  );
};
