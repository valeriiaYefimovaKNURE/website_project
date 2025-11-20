import { useCallback, useEffect, useState } from "react";

export const useFetchData = (fetchConfig) => {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        Object.entries(fetchConfig).map(async ([key, fn]) => {
          const result = await fn();
          return [key, result];
        })
      );
      
      setData(Object.fromEntries(results));
    } catch (error) {
      setError(error.message || "Помилка завантаження даних");
      console.error("Помилка завантаження даних:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchConfig]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};