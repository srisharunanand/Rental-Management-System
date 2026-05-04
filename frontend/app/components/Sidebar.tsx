'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Home, Building2, Users, FileText, CreditCard, TrendingUp, AlertCircle, MessageSquare, Settings } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function Sidebar({ open = true }: { open?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const navSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        { icon: <Home size={18} />, label: 'Dashboard', href: '/owner/dashboard' },
        { icon: <Building2 size={18} />, label: 'Properties', href: '/owner/houses' },
        { icon: <Users size={18} />, label: 'Tenants', href: '/owner/tenants', badge: 12 },
        { icon: <FileText size={18} />, label: 'Leases', href: '/owner/leases' },
      ],
    },
    {
      title: 'Finance',
      items: [
        { icon: <CreditCard size={18} />, label: 'Payments', href: '/owner/payments', badge: 3 },
        { icon: <TrendingUp size={18} />, label: 'Analytics', href: '/owner/analytics' },
        { icon: <FileText size={18} />, label: 'Invoices', href: '/owner/invoices' },
      ],
    },
    {
      title: 'Tools',
      items: [
        { icon: <AlertCircle size={18} />, label: 'Maintenance', href: '/owner/complaints', badge: 5 },
        { icon: <MessageSquare size={18} />, label: 'Messages', href: '/owner/messages' },
        { icon: <Settings size={18} />, label: 'Settings', href: '/owner/settings' },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('rentmanager_user');
    document.cookie = 'role=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-250 bg-slate-900 border-r border-slate-700 flex flex-column z-300 transition-transform duration-300 ${
        !open ? '-translate-x-full md:translate-x-0' : ''
      }`}
    >
      {/* Logo */}
      <div className="h-62 flex items-center gap-3 px-5 border-b border-slate-700 flex-shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
          🏠
        </div>
        <div>
          <div className="text-sm font-bold text-slate-100">RentManager</div>
          <div className="text-xs text-slate-500 uppercase tracking-wide">Property OS</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="px-2 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.badge && (
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-700 p-3 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
