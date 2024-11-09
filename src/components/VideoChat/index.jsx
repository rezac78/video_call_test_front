import { useEffect, useRef } from "react"

export const VideoChat = ({ stream, peers }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream
  }, [stream]);
  return <video
    ref={videoRef}
    autoPlay
    muted={true}
    className="w-full h-auto max-h-[70vh] "
  />
} 