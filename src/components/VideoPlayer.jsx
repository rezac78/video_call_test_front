import { useEffect, useRef } from "react";

export const VideoPlayer = ({ stream, className }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className={`relative ${className}`}>
      <video
        className="w-full h-full "
        ref={videoRef}
        autoPlay
        playsInline
      />
    </div>
  );
};
