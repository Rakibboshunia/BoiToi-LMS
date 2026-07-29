import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';

const typeIcon: Record<string, string> = {
  assignment_graded: '📝',
  live_class_started: '📹',
  new_assignment: '📋',
  course_enrolled: '🎓',
  certificate_issued: '🏆',
  default: '🔔',
};

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markRead, markAllRead } = useSocket();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-80 sm:w-96 bg-background border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-bold text-foreground text-sm">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead()}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-96 overflow-y-auto divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="mx-auto mb-3 text-muted-foreground/40" size={36} />
                  <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">No notifications yet.</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n._id}
                    onClick={() => markRead(n._id)}
                    className={`flex gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-secondary/30 ${
                      !n.isRead ? 'bg-primary/3' : ''
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">
                      {typeIcon[n.type] || typeIcon.default}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1.5">
                        {new Date(n.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-border px-5 py-3">
                <Link
                  to="/notifications"
                  onClick={() => setOpen(false)}
                  className="text-sm text-primary font-medium hover:text-primary/80 flex items-center justify-center gap-1 transition"
                >
                  View all notifications
                  <ChevronRight size={15} />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
