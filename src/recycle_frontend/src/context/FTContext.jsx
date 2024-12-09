import React, { createContext, useState, useContext } from 'react';

const FTContext = createContext();

export const FTProvider = ({ children }) => {
  const [ftsEarned, setFtsEarned] = useState(0);

  const incrementFtsEarned = () => setFtsEarned((prev) => prev + 1);

  return (
    <FTContext.Provider value={{ ftsEarned, incrementFtsEarned }}>
      {children}
    </FTContext.Provider>
  );
};

export const useFT = () => useContext(FTContext);