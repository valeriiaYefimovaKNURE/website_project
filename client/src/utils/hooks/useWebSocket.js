import { useEffect, useRef, useState } from 'react';

const useWebSocket = (newsId) => {
  const [viewersCount, setViewersCount] = useState(0);
  const [newComment, setNewComment] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!newsId) return;

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket("wss://localhost:8080");
        wsRef.current = ws;

        ws.onerror = (event) => {
          console.error("WebSocket помилка:", event);
          setIsConnected(false);
        };

        ws.onclose = (event) => {
          console.log("WebSocket закрито", event.code, event.reason);
          setIsConnected(false);

          // Автоматичне перепідключення
          if (event.code !== 1000) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log("Спроба перепідключення WebSocket...");
              connectWebSocket();
            }, 3000);
          }
        };

        ws.onopen = () => {
          console.log("WebSocket підключено успішно");
          setIsConnected(true);
          ws.send(JSON.stringify({ 
            type: "join", 
            data: { news_id: newsId } 
          }));
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            // Оновлюємо кількість глядачів
            if (message.type === "viewers_count" && message.data.news_id === newsId) {
              setViewersCount(message.data.count);
            }

            // Отримали новий коментар
            if (message.type === "new_comment") {
              const comment = message.data;
              if (comment.news_id === newsId) {
                setNewComment(comment);
              }
            }
          } catch (err) {
            console.error("Помилка обробки повідомлення WS:", err);
          }
        };
      } catch (err) {
        console.error("Не вдалося створити WebSocket:", err);
      }
    };

    connectWebSocket();

    // Cleanup
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, "Component unmounted");
      }
    };
  }, [newsId]);

  return { viewersCount, newComment, isConnected };
};

export default useWebSocket;