import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  suffix?: string;
}

export function KPICard({ title, value, trend, suffix }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-semibold text-gray-900">{value}</h3>
          {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${
              trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
