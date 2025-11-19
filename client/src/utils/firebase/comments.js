import axios from "axios";

export const fetchComments = async () => {
    try {
      const commentsInfo = await axios.get("https://localhost:8080/comments");

      const formatted = commentsInfo.data.map(c => {
        const firstReport = c.reports?.[0] || {};
        return {
          ...c,
          reason: firstReport.reason || "",
          status: firstReport.status || "",
          time: firstReport.time || "",
          reportId: firstReport.reportId || null,
        };
      });

      return formatted;
    } catch (error) {
      console.error("Помилка при завантаженні коментарів:", error);
      return [];
    }
};

export const fetchCommentsByNewsId = async (id) => {
   try{
     const { data } = await axios.get(`https://localhost:8080/comments/${id}`);

    return data.map(comment => {
      const [report = {}] = comment.reports || [];

      return {
        ...comment,
        reason: report.reason ?? "",
        status: report.status ?? "",
        time: report.time ?? "",
        reportId: report.reportId ?? null,
      };
    });

  }catch(error){
    console.error(" / Помилка при завантаженні коментарів новини:", error);
    return [];
  }
};

export const createComment=async(commentData)=>{
    try {
      const response = await fetch("https://localhost:8080/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Помилка при створенні коментаря");
      }

      const createdComment = await response.json();
      console.log("Коментарій створено:", createdComment);

    } catch (error) {
      console.error("createComment:", error.message);
      throw error;
    }
  }

export const handleSaveCommentsData=async(row, updatedFields)=>{
    try{
      const newsId=row.news_id;
      const commentId=row.id;

      if (!newsId || !commentId) throw new Error("news_id або id коментаря відсутні!");

      const response=await fetch(`https://localhost:8080/comments/${newsId}/${commentId}`,{
        method:"PUT",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(updatedFields)
      })
      if(!response.ok) throw new Error("Не вдалося зберегти зміни щодо оновлення репорту на коментар");
      console.log(response)

    }catch(error){
      console.error("handleSaveCommentsData(): Помилка при збереженні коментаря:", error.message);
      throw error;
    }
}

export const handleDeleteCommentsData = async (id, commentsArray) => {
    try {
      if (!id) throw new Error("Немає ID коментаря для видалення");

      const comment = commentsArray.find(c => c.id === id); 
      if (!comment) throw new Error("Не знайдено коментар для видалення");

      const response = await fetch(`https://localhost:8080/comments/${comment.news_id}/${id}`,{
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Помилка при видаленні коментаря");

    } catch (error) {
      console.error("handleDeleteCommentsData():", error.message);
      alert(error.message);
      throw error;
    }
  };