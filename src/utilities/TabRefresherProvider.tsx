// TabRefreshContext.tsx or TabRefreshProvider.tsx
import React, {createContext, useContext, useState, ReactNode} from 'react';

// Create a context for refreshing tabs
interface TabRefreshContextType {
  refreshTab: boolean;
  triggerTabRefresh: () => void;
}

const TabRefreshContext = createContext<TabRefreshContextType | undefined>(
  undefined,
);

// Export a hook to use the TabRefreshContext
export const useTabRefresh = (): TabRefreshContextType => {
  const context = useContext(TabRefreshContext);
  if (!context) {
    throw new Error('useTabRefresh must be used within a TabRefreshProvider');
  }
  return context;
};

// Provider component to wrap your app with
export const TabRefreshProvider = ({children}: {children: ReactNode}) => {
  const [refreshTab, setRefreshTab] = useState<boolean>(false);

  // Function to toggle the refresh flag
  const triggerTabRefresh = () => setRefreshTab(prev => !prev);

  return (
    <TabRefreshContext.Provider value={{refreshTab, triggerTabRefresh}}>
      {children}
    </TabRefreshContext.Provider>
  );
};
