import React from 'react';
import { User, LogOut, WifiOff, FileText, ChevronRight, Clock, CheckCircle, X } from 'lucide-react';

const Dashboard = ({ t, user, status, setScreen, setStatus, resetKyc, toggleVoice }) => {
  return (
    <div className="flex flex-col h-full relative">

      {/* Floating Voice Button - ALWAYS ON TOP */}
      < {/* Floating Voice Button - ALWAYS ON TOP */}
      <button
    onClick={toggleVoice}
    className="absolute top-2 right-16 bg-white text-indigo-900 p-2 rounded-full shadow-xl z-[9999]"
  >
    🔊
  </button>

      {/* Header */}
<div className="bg-indigo-900 text-white pt-6 p-6 pb-10 rounded-b-[2.5rem] shadow-xl relative z-10">

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center border border-indigo-500">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-bold">{user.name || "Aditya Kumar"}</h3>
              <p className="text-xs text-indigo-300">ID: 8839202</p>
            </div>
          </div>

          <button onClick={() => setScreen('login')}>
            <LogOut size={20} />
          </button>
        </div>

        <div className="text-center">
          <p className="text-indigo-300 text-sm mb-1">{t.status_label}</p>
          <div className="flex items-center justify-center gap-2">
            {status === 'none' && <span className="text-2xl font-bold text-gray-400">{t.not_verified}</span>}
            {status === 'submitted' && <span className="text-2xl font-bold text-yellow-400">{t.kyc_pending}</span>}
            {status === 'approved' && <span className="text-2xl font-bold text-green-400">{t.approved}</span>}
            {status === 'rejected' && <span className="text-2xl font-bold text-red-400">{t.rejected}</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 bg-gray-50 -mt-8 pt-12 px-6 overflow-y-auto">

        {/* Offline Indicator */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-[10px] text-gray-600 font-bold">
            <WifiOff size={12} /> {t.offline_mode}
          </div>
        </div>

        {/* Status: Not Verified */}
        {status === 'none' && (
          <div className="bg-white p-6 rounded-2xl shadow-md text-center border border-indigo-50">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
              <FileText size={32} />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">{t.app_name}</h3>
            <p className="text-gray-500 text-sm mb-6">{t.voice_intro}</p>
            <button
              onClick={() => setScreen('kyc_flow')}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              {t.start_kyc} <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Status: Submitted */}
        {status === 'submitted' && (
          <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-yellow-400">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{t.under_review}</h3>
                <p className="text-gray-500 text-sm mt-1">{t.review_desc}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status: Approved */}
        {status === 'approved' && (
          <div className="space-y-4">
            <div className="bg-green-50 p-6 rounded-2xl border border-green-200 flex items-center gap-4">
              <CheckCircle className="text-green-600" size={32} />
              <div>
                <h3 className="font-bold text-green-800">{t.approved}</h3>
                <p className="text-green-600 text-xs">{t.verified_msg}</p>
              </div>
            </div>

            {/* Mock Banking Features */}
            <div className="grid grid-cols-2 gap-4">
              {['Transfer', 'Statements', 'Cards', 'Loans'].map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 aspect-square"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                  <span className="font-bold text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status: Rejected */}
        {status === 'rejected' && (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
              <X size={24} />
            </div>
            <h3 className="font-bold text-red-800">{t.rejected}</h3>
            <p className="text-red-600 text-sm mb-4">{t.rejected_msg}</p>
            <button
              onClick={resetKyc}
              className="text-red-700 font-bold text-sm underline"
            >
              {t.retry}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
