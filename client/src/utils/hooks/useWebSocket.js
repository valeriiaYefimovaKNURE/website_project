import { useEffect, useState, useCallback, useRef } from 'react';
import useWebSocketLib from 'react-use-websocket';

const WS_URL = "wss://localhost:8080";

const useWebSocket = (newsId) => {
  const [viewersCount, setViewersCount] = useState(0);
  const [newComment, setNewComment] = useState(null);
  const [likesUpdate, setLikesUpdate] = useState(null);
  const didJoinRef = useRef(false);

  const { sendMessage, lastMessage, readyState } = useWebSocketLib(WS_URL, {
    shouldReconnect: () => true, // Автоматичне перепідключення
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    onOpen: () => {
      console.log('WebSocket підключено');
      didJoinRef.current = false; // Скидаємо при перепідключенні
    },
    onClose: () => {
      console.log('WebSocket закрито');
      didJoinRef.current = false;
    },
    onError: (event) => {
      console.error('WebSocket помилка:', event);
    },
  });

  // Відправляємо JOIN коли підключено і є newsId
  useEffect(() => {
    if (readyState === WebSocket.OPEN && newsId && !didJoinRef.current) {
      sendMessage(JSON.stringify({
        type: "join",
        data: { news_id: newsId }
      }));
      didJoinRef.current = true;
    }
  }, [readyState, newsId, sendMessage]);

  // Обробка отриманих повідомлень
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const msg = JSON.parse(lastMessage.data);

        // Кількість глядачів
        if (msg.type === "viewers_count" && msg.data.news_id === newsId) {
          setViewersCount(msg.data.count);
        }

        // Новий коментар
        if (msg.type === "new_comment" && msg.data.news_id === newsId) {
          setNewComment(msg.data);
        }
        // Оновлення лайків
        if (msg.type === "likes_updated" && msg.data.news_id === newsId) {
          setLikesUpdate(msg.data.likes);
        }       

      } catch (err) {
        console.error('Помилка парсингу:', err);
      }
    }
  }, [lastMessage, newsId]);

  // Скидаємо стан при зміні newsId
  useEffect(() => {
    setViewersCount(0);
    setNewComment(null);
    didJoinRef.current = false;
  }, [newsId]);

  const isConnected = readyState === WebSocket.OPEN;

  return { viewersCount, newComment, isConnected, likesUpdate };
};

export default useWebSocket;