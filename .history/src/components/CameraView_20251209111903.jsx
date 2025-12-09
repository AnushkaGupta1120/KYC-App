import React, { useRef, useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import * as faceapi from "face-api.js";

export default function CameraView({ instruction, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);

  // ---------------------------
  // LOAD FACE-API MODELS
  // ---------------------------
  const loadModels = async () => {
    const MODEL_URL = `${window.location.origin}/models`;
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  };

  // ---------------------------
  // CAMERA INIT
  // ---------------------------
  useEffect(() => {
    async function initCamera() {
      try {
        await loadModels();

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        alert("Camera access denied or not available!");
      }
    }

    initCamera();

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // ---------------------------
  // FACE DETECTION LOOP
  // ---------------------------
  useEffect(() => {
    let interval;

    interval = setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi.detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
      );

      const overlay = overlayRef.current;
      const canvas = canvasRef.current;

      if (!overlay || !canvas) return;

      const ctx = overlay.getContext("2d");
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      if (detections) {
        setFaceDetected(true);

        const box = detections.box;

        ctx.strokeStyle = "lime";
        ctx.lineWidth = 3;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
      } else {
        setFaceDetected(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // ---------------------------
  // CAPTURE SELFIE
  // ---------------------------
  const capturePhoto = () => {
    if (!faceDetected) {
      alert("No face detected. Please center your face in the frame.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Capture failed – empty image blob!");
          return;
        }
        onCapture(blob);
        onClose();
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">

      <button onClick={onClose} className="absolute top-5 right-5 text-white">
        <X size={32} />
      </button>

      <p className="text-white mb-4 text-center px-6">{instruction}</p>

      {/* VIDEO CONTAINER */}
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-80 h-64 rounded-xl bg-black shadow-lg object-cover"
          onLoadedMetadata={() => {
            overlayRef.current.width = videoRef.current.videoWidth;
            overlayRef.current.height = videoRef.current.videoHeight;
          }}
        />

        {/* FACE OVERLAY CANVAS */}
        <canvas
          ref={overlayRef}
          className="absolute top-0 left-0 w-80 h-64"
        ></canvas>
      </div>

      {/* CAPTURE BUTTON */}
      <button
        onClick={capturePhoto}
        disabled={!faceDetected}
        className={`mt-6 px-6 py-3 rounded-full flex items-center gap-2 font-bold
          ${
            faceDetected
              ? "bg-green-600 text-white"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }
        `}
      >
        <Camera size={20} />
        {faceDetected ? "Capture Selfie" : "No Face Detected"}
      </button>

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
