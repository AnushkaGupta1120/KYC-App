import { useState, useRef, useEffect } from "react";

export default function CameraView({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL("image/png");
    setCapturedImage(imgData);

    // send to parent if needed
    onCapture(imgData);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {!capturedImage ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              borderRadius: "12px",
              background: "#000",
            }}
          />
          <button
            onClick={capture}
            style={{ marginTop: 20, padding: "10px 20px" }}
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img
            src={capturedImage}
            alt="Captured selfie"
            style={{
              width: "100%",
              borderRadius: "12px",
            }}
          />
          <button
            onClick={() => setCapturedImage(null)}
            style={{ marginTop: 15 }}
          >
            Retake
          </button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
