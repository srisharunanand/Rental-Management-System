'use client';

import { Badge } from 'lucide-react';

interface Payment {
  id: number;
  tenant_name: string;
  unit_number: string;
  property_name: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  due_date: string;
  payment_date?: string;
}

interface PaymentTableProps {
  payments: Payment[];
  isLoading?: boolean;
}

const statusStyles = {
  paid: { bg: 'bg-green-500/10', text: 'text-green-400', label: '✓ Paid' },
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: '⏳ Pending' },
  overdue: { bg: 'bg-red-500/10', text: 'text-red-400', label: '✗ Overdue' },
};

export default function PaymentTable({ payments = [], isLoading = false }: PaymentTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No payments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tenant
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Unit
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Property
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Amount
            </th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Due Date
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const statusStyle = statusStyles[payment.status];
            return (
              <tr
                key={payment.id}
                className="border-b border-slate-700 hover:bg-slate-800/50 transition"
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-100">{payment.tenant_name}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-300">{payment.unit_number}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-300">{payment.property_name}</p>
                </td>
                <td className="px-4 py-3 text-right">
                  <p className="text-sm font-semibold text-slate-100">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </p>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {statusStyle.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-400">{new Date(payment.due_date).toLocaleDateString('en-IN')}</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
