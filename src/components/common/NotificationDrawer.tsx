import React, { useEffect } from 'react';
import { X, Bell, Check } from 'lucide-react';
import { format } from 'date-fns';
import axios from '../../constants/axiosInstance';
import { BASE_URL } from '../../constants/api';
import { useNavigate } from 'react-router-dom';

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const [notificationData, setNotificationData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
 
  const fetchNotification = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/notifications`);
      const data = response.data;
      setNotificationData(data.data)
      // console.log(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchNotification();
  }, []);


  const handleMarkAsRead = (notifId: string) => {
    axios.put(`${BASE_URL}/api/notifications/mark_as_read/${notifId}`, {}, {
      headers: {
        Authorization: `${localStorage.getItem('tokenId')}`,
      },
    })
      .then(() => {
        setNotificationData(prev =>
          prev.map(n => n._id === notifId ? { ...n, isRead: true } : n)
        );
      })
      .catch(error => {
        console.error('Error marking notification as read:', error);
      });

  };


  const dismiss = (notifId: string) => {
    console.log(notifId)
    const token = localStorage.getItem('tokenId');

    // if (!token || !notifId) return;
    axios.put(`${BASE_URL}/api/notifications/dismiss_notification/${notifId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setNotificationData(prev =>
          prev.filter(n => n._id !== notifId)
        );
      })
      .catch(error => {
        console.error('Error marking notification as read:', error);
      });

  };


  const markAllAsRead = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/api/notifications/mark_all_as_read`)
      fetchNotification();
    } catch (error) {
      console.error(error)
    }
  }
  const clearAllNotifications = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/api/notifications/dismiss_all_notification`)
      fetchNotification();
    } catch (error) {
      console.error(error)
    }
  }





  if (!open) return null;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} min ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return format(new Date(date), 'MMM d, yyyy');
    }
  };

  const handleredirect = async (e: React.FormEvent, notification: any) => {
    e.stopPropagation();
    handleMarkAsRead(notification._id);
    onClose();
    if (notification?.link) {
      navigate(notification.link);
    }
  }

  return (
    <>
      {/* Overlay */}
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
            {notificationData.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Mark all as read
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notificationData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Bell className="h-12 w-12 text-neutral-300 mb-4" />
              <p className="text-neutral-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {notificationData.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-neutral-50 transition-colors ${!notification.read ? 'bg-primary-50' : ''
                    }`}
                >
                  <div className="flex items-start" onClick={(e) => handleredirect(e, notification)}>
                    <div
                      className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${getNotificationColor(
                        notification.type
                      )}`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-neutral-900">
                          {notification.title}
                        </h3>
                        <span className="text-xs text-neutral-500 ml-2">
                          {formatTime(notification.updatedAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-neutral-600">{notification.message}</p>
                      <div className="mt-2 flex space-x-2">
                        {!notification?.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification?._id);
                            }}
                            className={`text-xs text-primary-600 hover:text-primary-800 flex items-center`}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismiss(notification?._id);
                          }} className="text-xs text-neutral-500 hover:text-neutral-700"
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

        {notificationData.length > 0 && (
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
