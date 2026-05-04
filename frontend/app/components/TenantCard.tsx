'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Calendar, Badge } from 'lucide-react';

interface TenantCardProps {
  id: number;
  name: string;
  email: string;
  phone?: string;
  unit_number?: string;
  property_name?: string;
  lease_start_date?: string;
  lease_end_date?: string;
  status?: 'active' | 'inactive' | 'pending';
  onClick?: () => void;
}

const statusColors = {
  active: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Active' },
  inactive: { bg: 'bg-slate-500/10', text: 'text-slate-400', label: 'Inactive' },
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Pending' },
};

export default function TenantCard({
  id,
  name,
  email,
  phone,
  unit_number,
  property_name,
  lease_start_date,
  lease_end_date,
  status = 'active',
  onClick,
}: TenantCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusStyle = statusColors[status];

  return (
    <div
      onClick={onClick}
      className="bg-slate-900 border border-slate-700 rounded-lg p-5 hover:border-slate-600 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Header with Avatar */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {getInitials(name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-400 transition truncate">
              {name}
            </h3>
            <p className="text-sm text-slate-500">{unit_number || 'No unit assigned'}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${statusStyle.bg} ${statusStyle.text}`}>
          {statusStyle.label}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {/* Email */}
        <div className="flex items-center gap-2 min-w-0">
          <Mail size={14} className="text-slate-500 flex-shrink-0" />
          <a
            href={`mailto:${email}`}
            className="text-sm text-slate-400 hover:text-cyan-400 transition truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {email}
          </a>
        </div>

        {/* Phone */}
        {phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-slate-500 flex-shrink-0" />
            <a
              href={`tel:${phone}`}
              className="text-sm text-slate-400 hover:text-cyan-400 transition"
              onClick={(e) => e.stopPropagation()}
            >
              {phone}
            </a>
          </div>
        )}

        {/* Property */}
        {property_name && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-500 flex-shrink-0" />
            <span className="text-sm text-slate-400">{property_name}</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-700 mb-4" />

      {/* Lease Info */}
      {(lease_start_date || lease_end_date) && (
        <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-slate-500" />
            <p className="text-xs font-medium text-slate-400">Lease Period</p>
          </div>
          <p className="text-sm text-slate-300">
            {lease_start_date && new Date(lease_start_date).toLocaleDateString('en-IN')}{' '}
            {lease_end_date && `- ${new Date(lease_end_date).toLocaleDateString('en-IN')}`}
          </p>
        </div>
      )}

      {/* Action Link */}
      <Link
        href={`/owner/tenants/${id}`}
        className="block w-full text-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 font-medium rounded-lg transition text-sm"
      >
        View Profile
      </Link>
    </div>
  );
}
