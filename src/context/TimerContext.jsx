import React, { createContext, useContext } from 'react';
import { usePomodoro } from '../hooks/usePomodoro';
import GlobalTimer from '../components/TaskManagement/panels/GlobalTimer';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const timerInstance = usePomodoro();

  return (
    <TimerContext.Provider value={timerInstance}>
      {children}
      {/* Injecting the global UI widget directly here guarantees it overlays everything */}
      <GlobalTimer timerInstance={timerInstance} />
    </TimerContext.Provider>
  );
};
