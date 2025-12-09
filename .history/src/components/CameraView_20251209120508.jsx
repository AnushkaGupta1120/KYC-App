import { useState, useRef, useEffect } from "react";

export default function CameraView({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);   // store stream safely

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        if (isMounted) {
          streamRef.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            await videoRef.current.play(); // ensures autoplay
          }
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("Camera permission required.");
      }
    };

    startCamera();

    // Cleanup
    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const base64 = canvas.toDataURL("image/png");
    onCapture(base64); // return the captured image
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-xl w-full max-w-sm shadow-md"
      />

      <button
        onClick={captureImage}
        className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold"
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
