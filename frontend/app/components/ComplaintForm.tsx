'use client';

import { useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';

interface ComplaintFormProps {
  onSubmit?: (formData: ComplaintData) => void;
  isLoading?: boolean;
}

interface ComplaintData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  unit_id?: number;
}

export default function ComplaintForm({ onSubmit, isLoading = false }: ComplaintFormProps) {
  const [formData, setFormData] = useState<ComplaintData>({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a complaint title');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
      setFormData({ title: '', description: '', priority: 'medium' });
    }
  };

  const priorityColors = {
    low: 'border-blue-500 bg-blue-500/5',
    medium: 'border-amber-500 bg-amber-500/5',
    high: 'border-red-500 bg-red-500/5',
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-2xl">
      <h2 className="text-lg font-semibold text-slate-100 mb-5 flex items-center gap-2">
        <AlertCircle size={20} className="text-red-400" />
        Report a Problem
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">Complaint Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Leaking pipe in bathroom"
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue in detail..."
          rows={4}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition resize-vertical"
        />
      </div>

      {/* Priority */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">Priority Level</label>
        <div className="grid grid-cols-3 gap-3">
          {(['low', 'medium', 'high'] as const).map((priority) => (
            <label key={priority} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="priority"
                value={priority}
                checked={formData.priority === priority}
                onChange={handleChange}
                className="w-4 h-4 cursor-pointer"
              />
              <span
                className={`ml-2 px-3 py-1 rounded-lg text-sm font-medium border ${priorityColors[priority]} ${
                  formData.priority === priority
                    ? 'text-slate-100'
                    : 'text-slate-400'
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 text-white font-medium rounded-lg transition disabled:cursor-not-allowed"
      >
        <Send size={18} />
        {isLoading ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
}
