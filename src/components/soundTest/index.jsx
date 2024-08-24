import { useEffect, useRef } from "react";

export const SoundTest = () => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const startTest = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        analyserRef.current = analyser;
        audioRef.current.srcObject = stream;
        audioRef.current.play();

        drawWaveform();
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };

  const stopTest = () => {
    const audioElement = audioRef.current;
    if (audioElement && audioElement.srcObject) {
      const tracks = audioElement.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      audioElement.srcObject = null;
    }
  };

  const drawWaveform = () => {
    if (!analyserRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
        requestAnimationFrame(draw);
        analyserRef.current.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = "#1A73E8";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.lineWidth = 1;
        canvasCtx.strokeStyle = "#FFFFFF";
        canvasCtx.beginPath();
        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;
  
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;
  
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
  
          x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      };
  
      draw();
    };

  useEffect(() => {
    startTest();

    return () => {
      stopTest();
    };
  }, []);
  return (
    <div className="absolute right-5">
      <audio ref={audioRef} />
      <canvas
        ref={canvasRef}
        width="25"
        height="25"
        className="mt-4 rounded-full"
      />
    </div>
  );
};
