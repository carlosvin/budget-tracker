import { createContext, useContext } from "react"
import { BudgetTracker } from "../interfaces";

const AppContext = createContext<BudgetTracker|undefined>(undefined);

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

export function useAppContext() {
    const context = useContext(AppContext)
    if (context === undefined) {
      throw new Error('useAppContext must be used within a AppProvider');
    }
    return context;
}
  