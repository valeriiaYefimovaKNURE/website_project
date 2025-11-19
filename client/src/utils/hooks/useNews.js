import { useEffect, useState } from "react";

export const useNews = (fn1,fn2) => {
    const [news, setNews] = useState([]);
    const [themes, setThemes] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try{
            const [newsData, themesData] = await Promise.all([
                fn1(),
                fn2()
            ]);
            setNews(newsData);
            setThemes(themesData);
        }catch(error){
            setError("Помилка завантаження даних:", error);
            console.error("Помилка завантаження даних:", error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return {news, themes, isLoading, refetch: fetchData, error};
}