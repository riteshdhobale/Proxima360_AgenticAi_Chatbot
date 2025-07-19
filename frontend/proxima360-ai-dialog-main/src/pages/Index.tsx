
import { useState } from "react";
import { ChatInterface } from "../components/ChatInterface";
import { Sidebar } from "../components/Sidebar";
import { NotificationPanel } from "../components/NotificationPanel";
import { DataVisualization } from "../components/DataVisualization";
import { SearchFilterPanel } from "../components/SearchFilterPanel";

const Index = () => {
  const [activeView, setActiveView] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 flex relative overflow-hidden">
      {/* Premium Background Texture with Enhanced Depth */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }}></div>

      {/* Multi-layer Glass Morphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/6 to-indigo-500/8"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/4 via-transparent to-pink-500/4"></div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Content Area with Enhanced Spacing */}
      <div className={`flex-1 transition-all duration-700 ease-in-out ${sidebarOpen ? 'ml-72' : 'ml-20'} relative z-10`}>
        <div className="h-screen flex">
          {/* Chat Interface with Professional Spacing */}
          <div className="flex-1 flex flex-col p-6 pr-3">
            <div className="flex-1 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
              {/* Subtle Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/2 pointer-events-none rounded-3xl"></div>
              <ChatInterface />
            </div>
          </div>

          {/* Right Panel with Enhanced Design */}
          <div className="w-96 p-6 pl-3">
            <div className="h-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden relative">
              {/* Multi-layer Glass Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/3 to-transparent pointer-events-none rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/6 via-purple-500/4 to-indigo-500/6 pointer-events-none rounded-3xl"></div>

              {/* Content */}
              <div className="relative z-10 h-full">
                {activeView === "notifications" && <NotificationPanel />}
                {activeView === "search" && <SearchFilterPanel />}
                {activeView === "analytics" && <DataVisualization />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
