import axios from "axios";

export const fetchNews = async () => {
    try {
      const newsInfo = await axios.get("http://localhost:8080/news");
      return newsInfo.data;
    } catch (error) {
      console.error("AdminPage / Помилка при завантаженні новин:", error);
      return [];
    }
  };

export const fetchNewsById = async(id) => {
  try{
    // if (!id ) throw new Error("news_id відсутнє!");
     const response = await axios.get(`http://localhost:8080/news/${id}`);
    return response.data;
  }catch(error){
    console.error("AdminPage / Помилка при завантаженні новини:", error);
    return null;
  }
};

export const createNews=async(newsData)=>{
    try {
      const response = await fetch("http://localhost:8080/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Помилка при створенні новини");
      }

      const createdNews = await response.json();
      console.log("Допис викладено:", createdNews);

    } catch (error) {
      console.error("createNews:", error.message);
      throw error;
    }
}

export const handleSaveNewsData=async(row, updatedFields)=>{
    try{
      const newsId=row.id;
      if (!newsId) throw new Error("Немає ID новини для оновлення");

      const response=await fetch(`http://localhost:8080/news/${newsId}`,{
        method:"PUT",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify(updatedFields)
      })

      if(!response.ok) throw new Error("Виникла помилка при оновленні даних новини");
      console.log(response);

    }catch(error){
      console.error("handleSaveNewsData(): Помилка при збереженні новини:", error.message);
      throw error;
    }
  }

export const handleDeleteNewsData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/news/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Помилка при видаленні новини");
    } catch (error) {
      console.error("handleDeleteNewsData():", error.message);
      throw error;
    }
  };