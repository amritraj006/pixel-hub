import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '@clerk/clerk-react';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      const socketInstance = io(import.meta.env.VITE_BACKEND_URL, {
        withCredentials: true,
      });

      setSocket(socketInstance);

      socketInstance.on('connect', () => {
        // Join personal rooms to receive notifications
        // We use both ID and Email just to be safe, since uploaded_by uses email
        socketInstance.emit('join', user.id);
        const email = user.primaryEmailAddress?.emailAddress;
        if (email) {
          socketInstance.emit('join', email);
        }
      });

      return () => {
        socketInstance.disconnect();
      };
    } else if (isLoaded && !user && socket) {
      // Disconnect if user logs out
      socket.disconnect();
      setSocket(null);
    }
  }, [user, isLoaded]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
