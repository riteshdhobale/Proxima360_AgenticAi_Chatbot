
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const allocationData = [
  { week: 'Week 1', allocated: 450, received: 420, efficiency: 93 },
  { week: 'Week 2', allocated: 520, received: 485, efficiency: 93 },
  { week: 'Week 3', allocated: 380, received: 350, efficiency: 92 },
  { week: 'Week 4', allocated: 610, received: 545, efficiency: 89 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#3B82F6' },
  { name: 'Clothing', value: 28, color: '#8B5CF6' },
  { name: 'Home & Garden', value: 20, color: '#10B981' },
  { name: 'Sports', value: 17, color: '#F59E0B' },
];

export const AllocationChart = () => {
  return (
    <Card className="p-6 bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">STORE-2 Allocation Summary</h3>
          <p className="text-sm text-slate-600">Last Month Performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
            <TrendingUp size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-700">87% Efficiency</span>
          </div>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">1,960</div>
          <div className="text-sm text-blue-700">Total Allocated</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">1,800</div>
          <div className="text-sm text-green-700">Successfully Received</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">92%</div>
          <div className="text-sm text-purple-700">Avg Efficiency</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Allocation Bar Chart */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">Weekly Allocation vs Received</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={allocationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="allocated" fill="#3B82F6" name="Allocated" radius={[2, 2, 0, 0]} />
              <Bar dataKey="received" fill="#10B981" name="Received" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Pie Chart */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">Category Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-slate-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-slate-100">
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Eye size={16} />
          <span>Detailed View</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Download size={16} />
          <span>Download Report</span>
        </Button>
        <Button variant="outline" size="sm">
          Check Another Store
        </Button>
      </div>
    </Card>
  );
};
