import Step1Personal from "./components/steps/Step1Personal";
import Step2Documents from "./components/steps/Step2Documents";
import Step3Selfie from "./components/steps/Step3Selfie";
import Step4Review from "./components/steps/Step4Review";

export default function KYCFlow({
  t,
  kycStep,
  setKycStep,
  formData,
  setFormData,
  handleFileUpload,
  submitKYC,
}) {
  const goBack = () => {
    if (kycStep > 1) setKycStep(kycStep - 1);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* HEADER */}
      <div className="bg-white p-4 shadow flex items-center gap-4">
        <button
          onClick={goBack}
          className="text-gray-600 font-bold text-xl px-2"
        >
          ←
        </button>

        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${(kycStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <span className="text-xs font-bold text-gray-500">
          {t.step_count} {kycStep}/4
        </span>
      </div>

      {/* BODY */}
      <div className="p-6 overflow-y-auto flex-1 animate-in slide-in-from-bottom-2 fade-in duration-500">
        {kycStep === 1 && (
          <Step1Personal
            t={t}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {kycStep === 2 && (
          <Step2Documents
            t={t}
            formData={formData}
            handleFileUpload={handleFileUpload}
            setFormData={setFormData}
            setKycStep={setKycStep}
          />
        )}

        {kycStep === 3 && (
          <Step3Selfie
            t={t}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {kycStep === 4 && (
          <Step4Review
            formData={formData}
            t={t}
          />
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 bg-white border-t">
        {kycStep < 4 ? (
          <button
            onClick={() => setKycStep(kycStep + 1)}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold active:scale-95 transition"
          >
            {t.next}
          </button>
        ) : (
          <button
            onClick={submitKYC}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold active:scale-95 transition"
          >
            {t.submit_btn}
          </button>
        )}
      </div>

    </div>
  );
}
