import React, { useRef, useEffect, useState } from "react";
import { Camera, X } from "lucide-react";

export default function CameraView({ instruction, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    async function openCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }, // front camera
          audio: false
        });
        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;
      } catch (err) {
        alert("Camera access denied!");
      }
    }

    openCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      onCapture(blob);
      onClose();
    }, "image/jpeg");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <button onClick={onClose} className="absolute top-5 right-5 text-white">
        <X size={32} />
      </button>

      <p className="text-white mb-4 text-center px-6">{instruction}</p>

      <video ref={videoRef} autoPlay playsInline className="w-80 rounded-xl shadow-lg" />

      <button
        onClick={capturePhoto}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full flex items-center gap-2 font-bold"
      >
        <Camera size={20} />
        Capture Selfie
      </button>

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
