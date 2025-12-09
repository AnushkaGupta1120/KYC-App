import Step1Personal from "./components/steps/Step1Personal";
import Step2Documents from "./components/steps/Step2Documents";
import Step3Selfie from "./components/steps/Step3Selfie";
import Step4Review from "./components/steps/Step4Review";

export default function KYCFlow({ t, kycStep, setKycStep, formData, setFormData, handleFileUpload, submitKYC }) {
  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* HEADER */}
      <div className="bg-white p-4 shadow flex items-center gap-4">
        <button onClick={() => setKycStep(kycStep - 1)}>←</button>
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${(kycStep / 4) * 100}%` }}
            />
          </div>
        </div>
        <span>{t.step_count} {kycStep}/4</span>
      </div>

      {/* BODY */}
      <div className="p-6 overflow-y-auto flex-1">
        {kycStep === 1 && <Step1Personal t={t} formData={formData} setFormData={setFormData} />}
        {kycStep === 2 && <Step2Documents formData={formData} handleFileUpload={handleFileUpload} />}
        {kycStep === 3 && <Step3Selfie formData={formData} setFormData={setFormData} t={t} />}
        {kycStep === 4 && <Step4Review formData={formData} t={t} />}
      </div>

      {/* FOOTER */}
      <div className="p-4 bg-white border-t">
        {kycStep < 4 ? (
          <button
            onClick={() => setKycStep(kycStep + 1)}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl"
          >
            {t.next}
          </button>
        ) : (
          <button
            onClick={submitKYC}
            className="w-full bg-green-600 text-white py-3 rounded-xl"
          >
            {t.submit_btn}
          </button>
        )}
      </div>

    </div>
  );
}
