{/* Header */}
<div className="bg-indigo-900 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-xl relative z-10">

  {/* Voice Button - NEW FIX */}
  <button
  onClick={toggleVoice}
  className="absolute -top-4 right-4 bg-white text-indigo-900 p-2 rounded-full shadow-md z-[9999]"
>
  🔊
</button>


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
