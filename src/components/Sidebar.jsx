import React from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  CheckCheck, 
  ClockAlert, 
  BarChart3, 
  BookOpenText, 
  Building, 
  ShieldCheck, 
  HelpCircle,
  FileCheck2,
  ChevronRight
} from 'lucide-react';

export function Sidebar({ 
  currentTab, 
  onSelectTab, 
  pendingCount = 0, 
  urgentMaturityCount = 0,
  overdueCount = 0,
  totalRecords = 0,
  onOpenGuidelines
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      description: 'Portfolio KPIs, summary & alerts',
    },
    {
      id: 'registry',
      label: 'Centralized FDR Registry',
      icon: FileSpreadsheet,
      description: 'Master ledger & search repository',
      badge: totalRecords > 0 ? totalRecords : null,
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'verification',
      label: 'Document Verification Desk',
      icon: CheckCheck,
      description: 'Audit & sanction submitted FDRs',
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
    },
    {
      id: 'maturity',
      label: 'Maturity Radar & Notices',
      icon: ClockAlert,
      description: 'Expiry alerts & renewal notices',
      badge: (urgentMaturityCount + overdueCount) > 0 ? (urgentMaturityCount + overdueCount) : null,
      badgeColor: overdueCount > 0 ? 'bg-red-100 text-red-900 border border-red-300 animate-pulse font-bold' : 'bg-amber-100 text-amber-900 font-bold',
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: BarChart3,
      description: 'Bank exposure & CSV ledger downloads',
    },
    {
      id: 'guidelines',
      label: 'AICTE Norms & Guidelines',
      icon: BookOpenText,
      description: 'APH Chapter II deposit mandates',
    },
  ];

  return (
    <aside className="w-64 bg-[#0B2545] text-slate-100 flex flex-col shrink-0 border-r border-blue-900/80 min-h-[calc(100vh-80px)]">
      {/* Official AICTE Watermark / Portal Info */}
      <div className="p-4 border-b border-blue-900/60 bg-[#081d37]">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-200">
          <Building className="w-4 h-4 text-amber-400" />
          <span>PORTAL NAVIGATION</span>
        </div>
        <p className="text-[11px] text-blue-300/70 mt-1">
          Financial & Compliance Registry Division
        </p>
      </div>

      {/* Main Navigation Menu */}
      <nav className="p-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all group cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-blue-100/90 hover:bg-blue-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-blue-300 group-hover:text-amber-400'
                  }`}
                />
                <div className="truncate">
                  <div className="text-xs font-medium truncate">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-blue-300/70'}`}>
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge !== null && item.badge !== undefined && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ml-2 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Smart India Hackathon Footer Panel */}
      <div className="p-4 border-t border-blue-900/60 bg-[#071930] text-xs">
        <div className="flex items-center space-x-2 text-amber-400 font-semibold mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>SIH-2024/26 Edition</span>
        </div>
        <p className="text-[11px] text-blue-200/80 leading-relaxed">
          AICTE Problem Statement: Digitize institutional security deposit management, verification, and automated maturity monitoring.
        </p>
        <div className="mt-2.5 pt-2 border-t border-blue-950 flex items-center justify-between text-[10px] text-blue-400">
          <span>Security Status: Secure</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>
    </aside>
  );
}
