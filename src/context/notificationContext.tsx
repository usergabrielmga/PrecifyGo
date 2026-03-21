import { createContext } from "react";

type NotificationContextType = {
  showNotification: (message: string) => void;
};

export const NotificationContext = createContext<NotificationContextType | null>(null);