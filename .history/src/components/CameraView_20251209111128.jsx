import React, { useRef, useEffect, useState } from "react";
import { Camera, X, AlertTriangle } from "lucide-react";
import * as faceapi from "face-api.js";

export default function CameraView({ instruction, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [warning, setWarning] = useState("Position your face inside the circle");

  // -----------------------------
  // Load Face Detection Models
  // -----------------------------
  useEffect(() => {
    async function loadModels() {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    }
    loadModels();
  }, []);

  // -----------------------------
  // Open Camera
  // -----------------------------
  useEffect(() => {
    async function openCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false
        });

        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;
      } catch (err) {
        alert("Camera access denied!");
      }
    }

    openCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, [stream]);

  // -----------------------------
  // Real-time Face Detection Loop
  // -----------------------------
  useEffect(() => {
    let interval;
    if (videoRef.current) {
      interval = setInterval(async () => {
        if (!videoRef.current) return;

        const detections = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );

        const overlay = overlayRef.current;
        const ctx = overlay.getContext("2d");

        overlay.width = videoRef.current.videoWidth;
        overlay.height = videoRef.current.videoHeight;

        ctx.clearRect(0, 0, overlay.width, overlay.height);

        // Circular frame overlay
        ctx.beginPath();
        const radius = overlay.width * 0.35;
        const centerX = overlay.width / 2;
        const centerY = overlay.height / 2;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#6366F1"; // Indigo
        ctx.stroke();

        if (detections) {
          setFaceDetected(true);
          setWarning("");

          // Draw face box
          const box = detections.box;
          ctx.strokeStyle = "#22C55E"; // Green
          ctx.lineWidth = 3;
          ctx.strokeRect(box.x, box.y, box.width, box.height);
        } else {
          setFaceDetected(false);
          setWarning("Face not detected. Please align inside the circle.");
        }
      }, 200);
    }

    return () => clearInterval(interval);
  }, []);

  // -----------------------------
  // Capture Photo Handler
  // -----------------------------
  const capturePhoto = () => {
    if (!faceDetected) {
      setWarning("Cannot capture — your face is not detected!");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      onCapture(blob);
      onClose();
    }, "image/jpeg", 0.95);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">

      {/* Close Button */}
      <button onClick={onClose} className="absolute top-5 right-5 text-white">
        <X size={32} />
      </button>

      {/* Instructions */}
      <p className="text-white mb-3 text-center px-6 text-lg font-medium">
        {instruction}
      </p>

      {/* Live View + Circular Overlay */}
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-80 h-auto rounded-xl shadow-lg bg-black"
        />

        <canvas
          ref={overlayRef}
          className="absolute top-0 left-0"
        />
      </div>

      {/* Warning */}
      {warning && (
        <div className="flex items-center gap-2 text-yellow-400 mt-3 text-sm">
          <AlertTriangle size={16} />
          {warning}
        </div>
      )}

      {/* Capture Button */}
      <button
        onClick={capturePhoto}
        className={`mt-5 px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-all 
          ${faceDetected ? "bg-green-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
        disabled={!faceDetected}
      >
        <Camera size={20} />
        {faceDetected ? "Capture Selfie" : "Align Face to Capture"}
      </button>

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
