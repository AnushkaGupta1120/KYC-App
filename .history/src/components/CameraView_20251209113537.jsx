// src/components/CameraView.jsx
import React, { useRef, useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import * as faceapi from "face-api.js";

export default function CameraView({ instruction, onClose, onCapture }) {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);     // canvas for face box
  const snapshotRef = useRef(null);    // canvas for final photo
  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let detectionInterval;

    const loadModels = async () => {
      try {
        // load once from /public/models
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        if (!isMounted) return;
        setModelsLoaded(true);
        startCamera();
      } catch (err) {
        console.error("Model load error", err);
        alert("Unable to load face detection models");
      }
    };

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (!isMounted) return;

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            startDetection();
          };
        }
      } catch (err) {
        console.error("Camera error", err);
        alert("Camera access denied!");
      }
    };

    const startDetection = () => {
      const video = videoRef.current;
      const canvas = overlayRef.current;
      if (!video || !canvas) return;

      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;

      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,        // smaller = faster
        scoreThreshold: 0.5,
      });

      detectionInterval = setInterval(async () => {
        if (!video || video.readyState !== 4) return;

        const detections = await faceapi
          .detectSingleFace(video, options)
          .withScore();

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections) {
          const { x, y, width, height } = detections.box;
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#22c55e";
          ctx.beginPath();
          ctx.rect(x, y, width, height);
          ctx.stroke();
        }
      }, 600); // run ~1.5 times/sec -> smoother, less lag
    };

    loadModels();

    return () => {
      isMounted = false;
      if (detectionInterval) clearInterval(detectionInterval);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = snapshotRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCapture(blob); // App will convert blob -> URL
        }
        onClose();
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <button onClick={onClose} className="absolute top-5 right-5 text-white">
        <X size={30} />
      </button>

      <p className="text-white mb-4 text-center px-6">{instruction}</p>

      <div className="relative w-80">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-xl shadow-lg bg-black"
        />
        {/* face box overlay */}
        <canvas
          ref={overlayRef}
          className="absolute inset-0 w-full h-full pointer-events-none rounded-xl"
        />
      </div>

      <button
        disabled={!modelsLoaded}
        onClick={capturePhoto}
        className={`mt-6 px-6 py-3 rounded-full flex items-center gap-2 font-bold ${
          modelsLoaded
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-gray-500 text-gray-200 cursor-not-allowed"
        }`}
      >
        <Camera size={20} />
        {modelsLoaded ? "Capture Selfie" : "Loading camera..."}
      </button>

      {/* hidden canvas only for final image data */}
      <canvas ref={snapshotRef} className="hidden" />
    </div>
  );
}
