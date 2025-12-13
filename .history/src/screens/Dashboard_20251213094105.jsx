import { useEffect } from "react";
import useVoice from "../voice/useVoice";

export default function Dashboard({ status, rejectionReason, t }) {
  const speak = useVoice();

  useEffect(() => {
    if (status === "rejected") {
      speak(
        `${t.voice_dashboard_rejected} ${t.voice_rejection_reason}: ${rejectionReason}`
      );
    }
  }, [status, rejectionReason, speak, t]);

  if (status !== "rejected") return null;

  return (
    <div className="bg-red-50 border border-red-200 p-5 rounded-xl">
      <h3 className="font-bold text-red-700 mb-2">
        {t.rejected}
      </h3>

      <p className="text-sm text-red-600">
        {rejectionReason}
      </p>

      <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-xl">
        {t.retry}
      </button>
    </div>
  );
}
