'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Settings, LogOut, Menu } from 'lucide-react';

interface NavbarProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function Navbar({ title = 'Dashboard', onMenuClick }: NavbarProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('rentmanager_user');
    document.cookie = 'role=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-250 right-0 h-62 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6 z-200">
      {/* Left: Menu & Title */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <Menu size={20} className="text-slate-300" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-800 rounded-lg transition">
          <Bell size={20} className="text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <Link href="/owner/settings" className="p-2 hover:bg-slate-800 rounded-lg transition">
          <Settings size={20} className="text-slate-300" />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg transition"
          >
            U
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2 z-50">
              <Link
                href="/owner/settings"
                className="block px-4 py-2 text-slate-300 hover:bg-slate-700 transition"
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
