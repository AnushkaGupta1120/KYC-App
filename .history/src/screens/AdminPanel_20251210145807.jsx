const AdminPanel = ({ t, kycStatus, formData, adminAction, setCurrentScreen }) => {

  console.log("AdminPanel mounted with status:", kycStatus);

  const renderPreview = (fileObj) => {
    if (!fileObj || !fileObj.files || fileObj.files.length === 0)
      return <span className="text-gray-400 text-xs">No file</span>;

    const file = fileObj.files[0];

    return (
      <img
        src={file.preview}
        className="w-full h-full object-cover rounded-lg"
        alt="uploaded"
      />
    );
  };

  const renderSelfie = () => {
    if (!formData || !formData.selfie)
      return <span className="text-gray-400 text-xs">Selfie not captured</span>;

    return (
      <img
        src={formData.selfie}
        className="w-full h-full object-cover rounded-lg"
        alt="selfie"
      />
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">

      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <button onClick={() => setCurrentScreen("login")}>
          ← {t.back}
        </button>

        <h2 className="font-bold flex items-center gap-2">
          {t.admin_panel}
        </h2>

        <button onClick={() => setCurrentScreen("login")}>
          {t.admin_logout}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-y-auto">

        <h3 className="text-gray-600 font-bold mb-4 uppercase text-xs tracking-widest">
          {t.pending_req}
        </h3>

        {kycStatus === "submitted" ? (
          <div className="bg-white rounded-xl shadow">

            <div className="p-4 border-b">
              <h4 className="font-bold">{formData?.name || "User"}</h4>
              <p className="text-xs text-gray-500">{t.submitted_just_now}</p>
            </div>

            <div className="p-4 grid grid-cols-2 gap-2">
              <div className="h-24 bg-gray-100 rounded-lg">
                {renderPreview(formData?.docFront)}
              </div>
              <div className="h-24 bg-gray-100 rounded-lg">
                {renderPreview(formData?.docBack)}
              </div>
              <div className="h-24 col-span-2 bg-gray-100 rounded-lg">
                {renderSelfie()}
              </div>
            </div>

            <div className="p-4 flex gap-3">
              <button
                onClick={() => adminAction("rejected")}
                className="flex-1 bg-red-100 text-red-600 p-2 rounded-lg"
              >
                {t.reject}
              </button>

              <button
                onClick={() => adminAction("approved")}
                className="flex-1 bg-green-600 text-white p-2 rounded-lg"
              >
                {t.approve}
              </button>
            </div>
          </div>

        ) : (
          <div className="text-center text-gray-400 py-20">
            {t.no_pending}
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminPanel;
