import React from "react";
import { Briefcase, CheckCircle } from "lucide-react";

const AdminPanel = ({ t, status, formData, setStatus, setScreen }) => {
  const adminAction = (action) => {
    setStatus(action);
    alert(action === "approved" ? "Approved" : "Rejected");
  };

  /* ------------------------------
        FILE PREVIEW HANDLER
  ------------------------------ */
  const renderPreview = (fileObj) => {
    if (!fileObj || !fileObj.files || fileObj.files.length === 0) {
      return <span className="text-gray-400 text-xs">No file</span>;
    }

    const file = fileObj.files[0];

    // PDF → filename only
    if (file.type?.includes("pdf")) {
      return (
        <div className="text-xs text-gray-600 text-center">
          <span className="font-bold">PDF File</span>
          <br />
          {file.name}
        </div>
      );
    }

    // Image → base64 preview
    return (
      <img
        src={file.preview} // IMPORTANT FIX
        alt="Document Preview"
        className="w-full h-full object-cover rounded-lg"
      />
    );
  };

  /* ------------------------------
        SELFIE PREVIEW HANDLER
  ------------------------------ */
  const renderSelfie = () => {
    // Selfie is stored as base64 string directly (not in previewURL)
    if (!formData.selfie || typeof formData.selfie !== "string") {
      return <span className="text-gray-400 text-xs">Selfie Not Captured</span>;
    }

    return (
      <img
        src={formData.selfie}
        alt="Selfie"
        className="w-full h-full object-cover rounded-lg"
      />
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* HEADER */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg">
        <button
          onClick={() => setScreen("login")}
          className="flex items-center gap-2 text-xs bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600"
        >
          ← {t.back}
        </button>

        <h2 className="font-bold text-lg flex items-center gap-2">
          <Briefcase size={20} /> {t.admin_panel}
        </h2>

        <button
          onClick={() => setScreen("login")}
          className="bg-gray-700 p-2 rounded-lg text-xs hover:bg-gray-600"
        >
          {t.admin_logout}
        </button>
      </div>

      {/* BODY */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-gray-600 font-bold mb-4 uppercase text-xs tracking-wider">
          {t.pending_req}
        </h3>

        {status === "submitted" ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* USER INFO */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-800">
                  {formData.name || "User"}
                </h4>
                <p className="text-xs text-gray-500">{t.submitted_just_now}</p>
              </div>
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold">
                PENDING
              </span>
            </div>

            {/* FILE PREVIEWS */}
           <div className="p-4 grid grid-cols-2 gap-3">

  {/* ID FRONT */}
  <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center overflow-hidden p-2">
    {renderPreview(formData.docFront)}
  </div>

  {/* ID BACK */}
  <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center overflow-hidden p-2">
    {renderPreview(formData.docBack)}
  </div>

  {/* SELFIE */}
  <div className="bg-gray-100 rounded-lg col-span-2 h-56 flex items-center justify-center overflow-hidden p-2">
    {renderSelfie()}
  </div>

</div>

            {/* ACTION BUTTONS */}
            <div className="p-4 bg-gray-50 flex gap-3">
              <button
                onClick={() => adminAction("rejected")}
                className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-bold shadow-sm hover:bg-red-50"
              >
                {t.reject}
              </button>
              <button
                onClick={() => adminAction("approved")}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold shadow-sm hover:bg-green-700"
              >
                {t.approve}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <CheckCircle size={48} className="mx-auto mb-4 opacity-20" />
            <p>{t.no_pending}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
