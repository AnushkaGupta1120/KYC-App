import UploadBox from "../UploadBox";

export default function Step2Documents({ formData, handleFileUpload }) {
  return (
    <div className="space-y-6">

      {/* Hidden Inputs */}
      <input
        id="frontInput"
        type="file"
        hidden
        accept="image/*,application/pdf"
        multiple
        onChange={(e) => handleFileUpload("docFront", Array.from(e.target.files))}
      />

      <input
        id="backInput"
        type="file"
        hidden
        accept="image/*,application/pdf"
        multiple
        onChange={(e) => handleFileUpload("docBack", Array.from(e.target.files))}
      />

      <UploadBox
        uploaded={!!formData.docFront}
        label="Upload Front Side"
        onClick={() => document.getElementById("frontInput").click()}
      />

      <UploadBox
        uploaded={!!formData.docBack}
        label="Upload Back Side"
        onClick={() => document.getElementById("backInput").click()}
      />

    </div>
  );
}
