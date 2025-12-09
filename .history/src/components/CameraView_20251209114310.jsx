import { useState, useRef, useEffect } from "react";

export default function CameraView({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
    });

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const base64 = canvas.toDataURL("image/png");
    onCapture(base64);   // return base64 string
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} autoPlay playsInline className="rounded-xl w-full" />

      <button
        onClick={captureImage}
        className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold"
      >
        Capture
      </button>

      <button
        onClick={onClose}
        className="text-gray-500 underline text-sm"
      >
        Close
      </button>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
