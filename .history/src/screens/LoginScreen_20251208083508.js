import React from 'react';
import { Shield, User, Briefcase } from 'lucide-react';
import React, { useEffect } from 'react';


const LoginScreen = ({ t, onLogin, onLangChange, currentLang }) => {
  // Safety check for t
  if (!t) return <div className="p-8 text-center text-red-500">Loading Localization...</div>;

  return (
    <div className="p-8 flex flex-col h-full justify-center bg-indigo-50">
       <div className="mb-8 text-center">
         <Shield size={64} className="text-indigo-600 mx-auto mb-4" />
         <h2 className="text-2xl font-bold text-gray-800">{t.app_name}</h2>
         <p className="text-gray-500">{t.voice_intro}</p>
       </div>

       <div className="space-y-4">
         <button onClick={() => onLogin('user')} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
           <User size={20} /> {t.login_user}
         </button>
         <button onClick={() => onLogin('admin')} className="w-full bg-white text-indigo-600 border-2 border-indigo-100 py-4 rounded-xl font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2">
           <Briefcase size={20} /> {t.login_admin}
         </button>
       </div>
       
       <div className="mt-8 flex justify-center gap-4">
         <button onClick={() => onLangChange('en')} className={`px-4 py-2 rounded-full text-xs font-bold ${currentLang==='en' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500'}`}>English</button>
         <button onClick={() => onLangChange('hi')} className={`px-4 py-2 rounded-full text-xs font-bold ${currentLang==='hi' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500'}`}>हिंदी</button>
       </div>
    </div>
  );
};

export default LoginScreen;