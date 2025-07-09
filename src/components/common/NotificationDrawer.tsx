import React, { useEffect } from 'react';
import { X, Bell, Check } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { format } from 'date-fns';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  } = useNotification();

  if (!open) return null;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-success-500';
      case 'warning': return 'bg-warning-500';
      case 'error': return 'bg-error-500';
      default: return 'bg-primary-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} min ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  useEffect(()=>{
    const fetchNotification=async()=>{
      try {
        const respponse=await axios.get(`${BASE_URL}/api/notifications`,{
        headers:{
           Authorization:`${localStorage.getItem("tokenId")}`
        }
      })
      const data=respponse.data
      console.log(data)
      } catch (error) {
         console.log(error)
      }
    }
    fetchNotification();
  })

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-800 bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg z-50 flex flex-col animate-slide-in">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={markAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Mark all as read
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Bell className="h-12 w-12 text-neutral-300 mb-4" />
              <p className="text-neutral-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-neutral-50 transition-colors ${!notification.read ? 'bg-primary-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${getNotificationColor(notification.type)}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-neutral-900">{notification.title}</h3>
                        <span className="text-xs text-neutral-500 ml-2">{formatTime(notification.timestamp)}</span>
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">{notification.message}</p>
                      <div className="mt-2 flex space-x-2">
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-primary-600 hover:text-primary-800 flex items-center"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark as read
                          </button>
                        )}
                        <button 
                          onClick={() => removeNotification(notification.id)}
                          className="text-xs text-neutral-500 hover:text-neutral-700"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-4 border-t border-neutral-200">
            <button 
              onClick={clearAllNotifications}
              className="w-full py-2 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md text-sm font-medium transition-colors"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationDrawer;