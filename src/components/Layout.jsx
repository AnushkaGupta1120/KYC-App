import React from 'react';

const Layout = ({ children }) => {
  return (
    // Outer Container: Centers the app and gives it a gray background (Desktop view)
    <div className="flex justify-center bg-gray-200 h-screen font-sans overflow-hidden select-none">
      
      {/* Mobile Container: The actual "Phone" frame */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col overflow-hidden">
        {children}
      </div>
      
    </div>
  );
};

export default Layout;