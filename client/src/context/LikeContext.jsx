// src/context/LikeContext.js
import React, { createContext, useContext, useState } from 'react';

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likeCount, setLikeCount] = useState(0);

  const increment = () => setLikeCount((prev) => prev + 1);
  const decrement = () => setLikeCount((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <LikeContext.Provider value={{ likeCount, increment, decrement }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLikeContext = () => useContext(LikeContext);
