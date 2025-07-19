
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, CheckCircle, Clock, Truck } from "lucide-react";

interface Notification {
  id: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Inventory Shortage',
    message: 'STORE-5 is running low on Electronics inventory (< 10% threshold)',
    timestamp: '5 min ago',
    isRead: false
  },
  {
    id: '2',
    type: 'success',
    title: 'Allocation Complete',
    message: 'Weekly allocation for STORE-2 has been successfully processed',
    timestamp: '1 hour ago',
    isRead: false
  },
  {
    id: '3',
    type: 'info',
    title: 'Transport Update',
    message: 'Delivery truck #TRK-001 is en route to STORE-3, ETA: 2:30 PM',
    timestamp: '2 hours ago',
    isRead: true
  },
  {
    id: '4',
    type: 'warning',
    title: 'Allocation Delay',
    message: 'STORE-7 allocation delayed due to supplier issues',
    timestamp: '3 hours ago',
    isRead: true
  },
  {
    id: '5',
    type: 'success',
    title: 'Report Generated',
    message: 'Monthly logistics report is ready for download',
    timestamp: '1 day ago',
    isRead: true
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'alert':
      return <AlertTriangle className="text-red-400" size={18} />;
    case 'success':
      return <CheckCircle className="text-green-400" size={18} />;
    case 'warning':
      return <Clock className="text-yellow-400" size={18} />;
    case 'info':
      return <Truck className="text-blue-400" size={18} />;
    default:
      return <Bell className="text-white/60" size={18} />;
  }
};

const getBackgroundColor = (type: string, isRead: boolean) => {
  if (isRead) return 'bg-white/5';

  switch (type) {
    case 'alert':
      return 'bg-red-500/10 border-red-400/30';
    case 'success':
      return 'bg-green-500/10 border-green-400/30';
    case 'warning':
      return 'bg-yellow-500/10 border-yellow-400/30';
    case 'info':
      return 'bg-blue-500/10 border-blue-400/30';
    default:
      return 'bg-white/5';
  }
};

export const NotificationPanel = () => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="h-full flex flex-col bg-transparent relative">
      {/* Premium background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-red-500/10 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bell className="text-white" size={16} />
            </div>
            <h2 className="font-semibold text-white text-lg">Notifications</h2>
          </div>
          {unreadCount > 0 && (
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full shadow-lg ring-2 ring-red-400/30">
              {unreadCount}
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3 relative z-10">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] backdrop-blur-sm border border-white/20 rounded-xl ${getBackgroundColor(notification.type, notification.isRead)
                }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-medium ${notification.isRead ? 'text-white/70' : 'text-white'
                      }`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 shadow-lg"></div>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${notification.isRead ? 'text-white/60' : 'text-white/80'
                    }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-white/50 mt-2">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 relative z-10">
        <Button
          variant="outline"
          className="w-full text-sm bg-white/10 backdrop-blur-sm border-white/20 text-white/80 hover:bg-white/20 hover:text-white rounded-xl transition-all"
        >
          Mark All as Read
        </Button>
      </div>
    </div>
  );
};
