const WebSocket = require("ws");

function initNewsSocket(server) {
  const wss = new WebSocket.Server({ server });
  const viewers = {};
  const clientNewsMap = new WeakMap();

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("message", (msg) => {
      try {
        const message = JSON.parse(msg);

        if (message.type === "join") {
          const { news_id } = message.data;
          const currentNewsId = clientNewsMap.get(ws);
          if (currentNewsId === news_id) return;

          if (currentNewsId && viewers[currentNewsId]) {
            viewers[currentNewsId].delete(ws);
            broadcastViewersCount(viewers, currentNewsId);
          }

          if (!viewers[news_id]) viewers[news_id] = new Set();
          viewers[news_id].add(ws);
          clientNewsMap.set(ws, news_id);

          broadcastViewersCount(viewers, news_id);
        }

        if (message.type === "new_comment") {
          broadcastNewComment(message.data);
        }
      } catch (err) {
        console.error("WebSocket message error:", err.message);
      }
    });

    ws.on("close", () => {
      const news_id = clientNewsMap.get(ws);
      if (news_id && viewers[news_id]) {
        viewers[news_id].delete(ws);
        broadcastViewersCount(viewers, news_id);
        if (!viewers[news_id].size) delete viewers[news_id];
        clientNewsMap.delete(ws);
      }
    });
  });

  function broadcastNewComment(comment) {
    const newsViewers = viewers[comment.news_id];
    if (!newsViewers) return;

    newsViewers.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: "new_comment",
          data: comment
        }));
      }
    });
  }

  function broadcastViewersCount(viewersMap, news_id) {
    const count = viewersMap[news_id]?.size || 0;
    viewersMap[news_id]?.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "viewers_count", data: { news_id, count } }));
      }
    });
  }

  return { viewers, broadcastNewComment };
}

module.exports = { initNewsSocket };