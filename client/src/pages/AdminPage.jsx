import React, { useEffect, useState }from 'react'
import axios from "axios"
import UserTable from '../components/Tables/UserTable';
import NewsTable from '../components/Tables/NewsTable';
import CommentsTable from '../components/Tables/CommentsTable';

function AdminPage() {
  const [selectedText, setSelectedText] = useState("")
  const [users, setUsers] = useState([]);
  const [news,setNews]=useState([]);
  const [comments, setComments] = useState([]);

  const handleSaveCommentsData=async(editedData)=>{
    try{
      const response=await fetch(`http://localhost:8080/reported-comments/${editedData.news_id}/${editedData.id}`,{
        method:"PUT",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({editedData})
      })
      if(!response.ok) throw new Error("Не вдалося зберегти зміни щодо оновлення репорту на коментар");
      console.log(response)

      await fetchComments();
    }catch(error){
      console.error("handleSaveCommentsData(): Помилка при збереженні коментаря:", error.message);
    }
  }

  const handleSaveUserData=async(editedData)=>{
    try{
      const response=await fetch(`http://localhost:8080/users/${editedData.id}`,{
        method:"PUT",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({editedData})
      })
      if(!response.ok) throw new Error("Не вдалося зберегти зміни щодо оновлення даних користувача");

      await fetchUsers();
    }catch(error){
      console.error("handleSaveUserData(): Помилка при збереженні даних користувача:", error.message);
    }
  }

  const handleSaveNewsData=async(editedData)=>{
    try{
      const response=await fetch(`http://localhost:8080/news/${editedData.id}`,{
        method:"PUT",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({editedData})
      })
      if(!response.ok) throw new Error("Не вдалося зберегти зміни щодо оновлення новини");

      await fetchUsers();
    }catch(error){
      console.error("handleSaveNewsData(): Помилка при збереженні новини:", error.message);
    }
  }

  const fetchUsers = async () => {
    try {
      const userInfo = await axios.get("http://localhost:8080/users");
      setUsers(userInfo.data);
    } catch (error) {
      console.error("AdminPage / Помилка при завантаженні користувачів:", error);
    }
  };
  
  const fetchNews = async () => {
    try {
      const newsInfo = await axios.get("http://localhost:8080/news");
      setNews(newsInfo.data);
    } catch (error) {
      console.error("AdminPage / Помилка при завантаженні новин:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsInfo = await axios.get("http://localhost:8080/reported-comments");
      setComments(commentsInfo.data);
    } catch (error) {
      console.error("Помилка при завантаженні коментарів:", error);
    }
};


  useEffect(() => {
    if (selectedText === "Users") {
      fetchUsers();
    } else if (selectedText === "News") {
      fetchNews();
    } else if (selectedText === "Comments") {
      fetchComments();
    }
  }, [selectedText]);

  return (
    <div className="flex flex-col items-center w-full m-2">
      <h1 className=''>Hello admins</h1>
      <div className='flex space-x-6 m-10'>
        <button onClick={() => setSelectedText("Users")}>Users</button>
        <button onClick={() => setSelectedText("News")}>News</button>
        <button onClick={() => setSelectedText("Comments")}>Comments</button>
        <button onClick={() => setSelectedText("Reports")}>Reports</button>
      </div>
      <input type="search" placeholder="Пошук..." />
      <h1>{selectedText}</h1>

      <div className="w-full flex justify-center items-center min-h-screen">
      {/* Таблиця користувачів */}
      {selectedText === "Users" && users && users.length > 0 ? (
          <UserTable users={users} onSave={handleSaveUserData} />
        ) : selectedText === "Users" ? (
          <p>Немає користувачів</p>
        ) : null
      }

      {/* Таблиця Новин */}
      {selectedText === "News" && news && news.length > 0 ? (
          <NewsTable news={news} onSave={handleSaveNewsData} />
        ) : selectedText === "News" ? (
          <p>Немає новин</p>
        ) : null
      }

      {/* Таблиця Коментарі */}
      {selectedText === 'Comments' && comments && comments.length > 0 ? (
          <CommentsTable comments={comments} onSave={handleSaveCommentsData} />
        ) : selectedText === "Comments" ? (
          <p>Немає коментарів з скаргами</p>
        ) : null
      }
      
      </div>
    </div>
  )
}

export default AdminPage