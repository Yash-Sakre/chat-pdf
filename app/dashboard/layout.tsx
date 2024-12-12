import React from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";

function DashboardLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <div className="flex flex-col md:flex-row h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col w-full">
          <Header />
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
  );
}

export default DashboardLayout;
