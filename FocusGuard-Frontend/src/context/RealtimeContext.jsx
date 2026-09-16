import { createContext, useContext, useEffect, useRef, useState } from "react";

const RealtimeContext = createContext({ connected: false });

const websocketUrl = (token) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  const base = apiUrl.replace(/\/api\/?$/, "").replace(/^http/, "ws").replace(/\/$/, "");
  return `${base}/ws/realtime/?token=${encodeURIComponent(token)}`;
};

export function RealtimeProvider({ children }) {
  const socketRef = useRef(null);
  const reconnectRef = useRef(null);
  const attemptsRef = useRef(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let disposed = false;

    const closeSocket = () => {
      window.clearTimeout(reconnectRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };

    const connect = () => {
      const token = localStorage.getItem("access");
      if (disposed || !token || socketRef.current) return;

      const socket = new WebSocket(websocketUrl(token));
      socketRef.current = socket;
      socket.onopen = () => { attemptsRef.current = 0; setConnected(true); };
      socket.onmessage = ({ data }) => {
        try {
          window.dispatchEvent(new CustomEvent("focusguard:realtime", { detail: JSON.parse(data) }));
        } catch (error) { console.error("Invalid realtime event", error); }
      };
      socket.onclose = () => {
        socketRef.current = null;
        setConnected(false);
        if (!disposed && localStorage.getItem("access")) {
          const delay = Math.min(30_000, 1_000 * 2 ** attemptsRef.current++);
          reconnectRef.current = window.setTimeout(connect, delay);
        }
      };
      socket.onerror = () => socket.close();
    };

    connect();
    const onStorage = (event) => {
      if (event.key === "access") { closeSocket(); connect(); }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focusguard:auth-changed", onStorage);
    return () => { disposed = true; window.removeEventListener("storage", onStorage); window.removeEventListener("focusguard:auth-changed", onStorage); closeSocket(); };
  }, []);

  return <RealtimeContext.Provider value={{ connected }}>{children}</RealtimeContext.Provider>;
}

export const useRealtime = () => useContext(RealtimeContext);
