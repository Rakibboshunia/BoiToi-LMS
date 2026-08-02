import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  joinCourse: (courseId: string) => void;
  joinLive: (roomId: string) => void;
  leaveLive: (roomId: string) => void;
  sendLiveMessage: (roomId: string, message: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('new_notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      // Play a subtle notification sound or show toast here
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, user]);

  const markRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const joinCourse = (courseId: string) => {
    socketRef.current?.emit('join_course', courseId);
  };

  const joinLive = (roomId: string) => {
    socketRef.current?.emit('join_live_class', roomId);
  };

  const leaveLive = (roomId: string) => {
    socketRef.current?.emit('leave_live_class', roomId);
  };

  const sendLiveMessage = (roomId: string, message: string) => {
    socketRef.current?.emit('live_message', { roomId, message });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      isConnected,
      notifications,
      unreadCount,
      markRead,
      markAllRead,
      joinCourse,
      joinLive,
      leaveLive,
      sendLiveMessage,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    // Return a safe default instead of crashing
    return {
      socket: null,
      isConnected: false,
      notifications: [],
      unreadCount: 0,
      markRead: () => {},
      markAllRead: () => {},
      joinCourse: () => {},
      joinLive: () => {},
      leaveLive: () => {},
      sendLiveMessage: () => {},
    };
  }
  return ctx;
};
