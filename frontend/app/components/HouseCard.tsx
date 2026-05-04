'use client';

import Link from 'next/link';
import { MapPin, Users, DoorOpen, TrendingUp, ChevronRight } from 'lucide-react';

interface HouseCardProps {
  id: number;
  name: string;
  address: string;
  total_units: number;
  occupied_units: number;
  monthly_revenue?: number;
  image?: string;
  onClick?: () => void;
}

export default function HouseCard({
  id,
  name,
  address,
  total_units,
  occupied_units,
  monthly_revenue = 0,
  onClick,
}: HouseCardProps) {
  const occupancyRate = Math.round((occupied_units / total_units) * 100);
  const vacant = total_units - occupied_units;

  return (
    <div
      onClick={onClick}
      className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Header with gradient */}
      <div className="h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-b border-slate-700 flex items-center justify-center">
        <div className="text-5xl">🏢</div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-cyan-400 transition">
          {name}
        </h3>

        {/* Address */}
        <div className="flex items-start gap-2 mb-4">
          <MapPin size={16} className="text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-400">{address}</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-700 mb-4" />

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Total Units */}
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DoorOpen size={14} className="text-cyan-400" />
            </div>
            <p className="text-lg font-semibold text-slate-100">{total_units}</p>
            <p className="text-xs text-slate-500">Total Units</p>
          </div>

          {/* Occupied */}
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users size={14} className="text-green-400" />
            </div>
            <p className="text-lg font-semibold text-slate-100">{occupied_units}</p>
            <p className="text-xs text-slate-500">Occupied</p>
          </div>

          {/* Vacant */}
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <ChevronRight size={14} className="text-amber-400" />
            </div>
            <p className="text-lg font-semibold text-slate-100">{vacant}</p>
            <p className="text-xs text-slate-500">Vacant</p>
          </div>
        </div>

        {/* Occupancy Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Occupancy Rate</span>
            <span className="text-sm font-semibold text-cyan-400">{occupancyRate}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Revenue */}
        {monthly_revenue > 0 && (
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-400" />
              <span className="text-sm text-slate-300">Monthly Revenue</span>
            </div>
            <span className="font-semibold text-green-400">
              ₹{monthly_revenue.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/owner/houses/${id}`}
          className="block w-full text-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
