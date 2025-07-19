
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Download, RefreshCw } from "lucide-react";
import { useState } from "react";

const performanceData = [
  { month: 'Jan', efficiency: 85, volume: 1200, cost: 45000 },
  { month: 'Feb', efficiency: 88, volume: 1350, cost: 48000 },
  { month: 'Mar', efficiency: 92, volume: 1480, cost: 52000 },
  { month: 'Apr', efficiency: 87, volume: 1320, cost: 47000 },
  { month: 'May', efficiency: 94, volume: 1560, cost: 55000 },
  { month: 'Jun', efficiency: 91, volume: 1420, cost: 51000 },
];

const storeComparison = [
  { store: 'STORE-1', efficiency: 94, volume: 320 },
  { store: 'STORE-2', efficiency: 87, volume: 280 },
  { store: 'STORE-3', efficiency: 91, volume: 310 },
  { store: 'STORE-4', efficiency: 83, volume: 250 },
  { store: 'STORE-5', efficiency: 89, volume: 290 },
  { store: 'STORE-6', efficiency: 86, volume: 270 },
  { store: 'STORE-7', efficiency: 92, volume: 300 },
];

export const DataVisualization = () => {
  const [selectedMetric, setSelectedMetric] = useState('efficiency');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  return (
    <div className="h-full flex flex-col bg-transparent relative">
      {/* Premium background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-blue-500/10 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="text-white" size={16} />
            </div>
            <h2 className="font-semibold text-white text-lg">Analytics Dashboard</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-white/10 space-y-3 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-white/90 mb-1 block">Metric</label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="h-8 text-xs bg-white/10 backdrop-blur-sm border-white/20 text-white rounded-lg hover:bg-white/15">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 rounded-xl">
                <SelectItem value="efficiency" className="text-white hover:bg-white/10">Efficiency</SelectItem>
                <SelectItem value="volume" className="text-white hover:bg-white/10">Volume</SelectItem>
                <SelectItem value="cost" className="text-white hover:bg-white/10">Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-white/90 mb-1 block">Period</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="h-8 text-xs bg-white/10 backdrop-blur-sm border-white/20 text-white rounded-lg hover:bg-white/15">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 rounded-xl">
                <SelectItem value="3months" className="text-white hover:bg-white/10">3 Months</SelectItem>
                <SelectItem value="6months" className="text-white hover:bg-white/10">6 Months</SelectItem>
                <SelectItem value="1year" className="text-white hover:bg-white/10">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-blue-300">89.7%</div>
                <div className="text-xs text-blue-400">Avg Efficiency</div>
              </div>
              <TrendingUp className="text-blue-400" size={16} />
            </div>
            <div className="text-xs text-blue-300 mt-1">+2.3% vs last period</div>
          </Card>

          <Card className="p-3 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-400/30 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-green-300">8,330</div>
                <div className="text-xs text-green-400">Total Volume</div>
              </div>
              <TrendingUp className="text-green-400" size={16} />
            </div>
            <div className="text-xs text-green-300 mt-1">+15.2% vs last period</div>
          </Card>
        </div>

        {/* Performance Trend */}
        <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Performance Trend</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
            >
              <Download size={14} />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.8)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.8)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#3B82F6"
                fill="url(#colorGradient)"
                fillOpacity={0.3}
                strokeWidth={3}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Store Comparison */}
        <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Store Comparison</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
            >
              <Download size={14} />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={storeComparison} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.8)' }} />
              <YAxis dataKey="store" type="category" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.8)' }} width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Bar
                dataKey={selectedMetric === 'efficiency' ? 'efficiency' : 'volume'}
                fill="#8B5CF6"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-2">
          <Card className="p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">Best Performing Store</span>
              <span className="text-sm font-semibold text-slate-800">STORE-1 (94%)</span>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">Needs Attention</span>
              <span className="text-sm font-semibold text-red-600">STORE-4 (83%)</span>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">Total Cost Savings</span>
              <span className="text-sm font-semibold text-green-600">$12,450</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200">
        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" size="sm">
          Generate Full Report
        </Button>
      </div>
    </div>
  );
};
