import React from 'react';
import { Briefcase, CheckCircle } from 'lucide-react';

const AdminPanel = ({ t, status, formData, setStatus, setScreen }) => {
  const adminAction = (action) => {
    setStatus(action);
    alert(action === 'approved' ? 'Approved' : 'Rejected');
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">

      {/* FIXED HEADER */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-lg">

        {/* BACK BUTTON */}
        <button 
          onClick={() => setScreen('login')}
          className="flex items-center gap-2 text-xs bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600"
        >
          ← {t.back}
        </button>

        {/* TITLE */}
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Briefcase size={20} /> {t.admin_panel}
        </h2>

        {/* LOGOUT BUTTON */}
        <button 
          onClick={() => setScreen('login')}
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

        {status === 'submitted' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

            <div className="p-4 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-800">{formData.name || "Aditya Kumar"}</h4>
                <p className="text-xs text-gray-500">{t.submitted_just_now}</p>
              </div>
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold">
                PENDING
              </span>
            </div>

            <div className="p-4 grid grid-cols-2 gap-2">
              <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center text-xs text-gray-400">ID Front</div>
              <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center text-xs text-gray-400">ID Back</div>
              <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center text-xs text-gray-400 col-span-2">Selfie</div>
            </div>

            <div className="p-4 bg-gray-50 flex gap-3">
              <button 
                onClick={() => adminAction('rejected')}
                className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-bold shadow-sm hover:bg-red-50"
              >
                {t.reject}
              </button>
              <button 
                onClick={() => adminAction('approved')}
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
