import { useState } from "react";
import { NotificationContext } from "./notificationContext";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");

  function showNotification(msg: string) {
    setMessage(msg);

    setTimeout(() => {
      setMessage("");
    }, 3000); // 3 segundos
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {message && <div className="notification">{message}</div>}
    </NotificationContext.Provider>
  );
}