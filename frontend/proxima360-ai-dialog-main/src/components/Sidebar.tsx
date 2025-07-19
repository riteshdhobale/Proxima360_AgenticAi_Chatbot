
import { useState } from "react";
import {
  MessageCircle,
  Search,
  Bell,
  BarChart3,
  Settings,
  Menu,
  Truck,
  Package,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ isOpen, onToggle, activeView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: "chat", icon: MessageCircle, label: "Chat", color: "text-blue-400" },
    { id: "search", icon: Search, label: "Search & Filter", color: "text-emerald-400" },
    { id: "notifications", icon: Bell, label: "Notifications", color: "text-amber-400" },
    { id: "analytics", icon: BarChart3, label: "Analytics", color: "text-violet-400" },
    { id: "inventory", icon: Package, label: "Inventory", color: "text-indigo-400" },
    { id: "transport", icon: Truck, label: "Transport", color: "text-rose-400" },
    { id: "team", icon: Users, label: "Team", color: "text-cyan-400" },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      {/* Professional Enterprise Sidebar with Glass Morphism */}
      <div className={`fixed left-0 top-0 h-full bg-slate-900/80 backdrop-blur-2xl border-r border-slate-700/50 transition-all duration-700 ease-in-out z-50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] ${isOpen ? 'w-72' : 'w-20'
        }`}>
        {/* Premium Multi-layer Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/3 to-transparent pointer-events-none rounded-r-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/6 to-indigo-500/8 pointer-events-none rounded-r-xl"></div>

        {/* Subtle Inner Border for Premium Feel */}
        <div className="absolute inset-0 border border-white/10 rounded-r-xl pointer-events-none"></div>

        {/* Professional Header with Better Spacing */}
        <div className="p-6 border-b border-slate-700/30 relative z-10">
          <div className="flex items-center justify-between">
            {isOpen && (
              <div className="flex items-center space-x-4 animate-in fade-in duration-500">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/20 ring-offset-2 ring-offset-slate-900">
                  <span className="text-white font-bold text-lg tracking-tight">P360</span>
                </div>
                <div>
                  <span className="font-bold text-white text-xl tracking-tight">Proxima360</span>
                  <p className="text-sm text-slate-300 mt-0.5">AI Assistant</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-3 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 rounded-xl hover:scale-105"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>

        {/* Enhanced Navigation with Perfect Spacing */}
        <nav className={`relative z-10 ${isOpen ? 'p-6' : 'p-3'} space-y-3`}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeView === item.id;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center ${isOpen ? 'space-x-4 px-4 py-4' : 'justify-center py-4'} 
                      rounded-2xl transition-all duration-300 group relative overflow-hidden
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-indigo-500/20 border border-white/20 shadow-lg backdrop-blur-sm scale-[1.02]'
                        : 'hover:bg-white/10 hover:backdrop-blur-sm hover:scale-[1.01] hover:shadow-md'
                      }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Active State Glow Effect */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/8 to-indigo-500/10 rounded-2xl animate-pulse"></div>
                    )}

                    {/* Icon with Enhanced Styling */}
                    <div className={`relative z-10 ${isOpen ? '' : 'mx-auto'}`}>
                      <IconComponent
                        size={22}
                        className={`transition-all duration-300 ${isActive
                            ? `${item.color} drop-shadow-sm`
                            : 'text-slate-400 group-hover:text-white group-hover:scale-110'
                          }`}
                      />
                    </div>

                    {/* Text Label with Smooth Animation */}
                    {isOpen && (
                      <span className={`font-medium relative z-10 transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}>
                        {item.label}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right" className="bg-slate-800 border-slate-700 text-white">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Enhanced Footer with Professional Styling */}
        {isOpen && (
          <div className="absolute bottom-6 left-6 right-6 relative z-10">
            <Button
              variant="ghost"
              className="w-full justify-start space-x-4 px-4 py-4 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-white/20 hover:shadow-md"
            >
              <Settings size={22} className="text-slate-400" />
              <span className="text-slate-300 font-medium">Settings</span>
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
