import React, { useEffect, useState, useCallback }from 'react'
import UserTable from '../components/Tables/UserTable';
import NewsTable from '../components/Tables/NewsTable';
import CommentsTable from '../components/Tables/CommentsTable';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import {fetchComments,createComment, handleSaveCommentsData, handleDeleteCommentsData} from '../utils/firebase/comments';
import { fetchNews, createNews, handleSaveNewsData, handleDeleteNewsData } from '../utils/firebase/news';
import { fetchUsers, createUser, handleSaveUserData, handleDeleteUserData } from '../utils/firebase/users';

function AdminPage() {
  const {user}=useUser();
  const navigate=useNavigate();
  const [selectedText, setSelectedText] = useState("")
  const [users, setUsers] = useState([]);
  const [news,setNews]=useState([]);
  const [comments, setComments]=useState([]);

  const loadUsers = useCallback(async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Помилка завантаження користувачів:", error);
    }
  }, []);

  const loadNews = useCallback(async () => {
    try {
      const newsData = await fetchNews();
      setNews(newsData);
    } catch (error) {
      console.error("Помилка завантаження новин:", error);
    }
  }, []);

  const loadComments = useCallback(async () => {
    try {
      const commentsData = await fetchComments();
      setComments(commentsData);
    } catch (error) {
      console.error("Помилка завантаження коментарів:", error);
    }
  }, []);



  const OnCreateUser = async (userData) => {
    await createUser(userData);
    await loadUsers();
  };

  const OnSaveUserData = async (row, updatedFields) => {
    await handleSaveUserData(row, updatedFields);
    await loadUsers();
  };

  const OnDeleteUserData = async (userId) => {
    await handleDeleteUserData(userId);
    await loadUsers();
  };

  const OnCreateNews = async (newsData) => {
    await createNews(newsData);
    await loadNews();
  };

  const OnSaveNewsData = async (row, updatedFields) => {
    await handleSaveNewsData(row, updatedFields);
    await loadNews();
  };

  const OnDeleteNewsData = async (id) => {
    await handleDeleteNewsData(id);
    await loadNews();
  };

  const OnCreateComment = async (commentData) => {
    await createComment(commentData);
    await loadComments();
  };

  const OnSaveCommentsData = async (row, updatedFields) => {
    await handleSaveCommentsData(row, updatedFields);
    await loadComments();
  };

  const OnDeleteCommentsData = async (id) => {
    await handleDeleteCommentsData(id, comments);
    await loadComments();
  };

  useEffect(() => {
    if (!user) {
      navigate("/"); 
    }
  }, [user, navigate]);

  useEffect(() => {
    if (selectedText === "Users") {
      loadUsers();
    } else if (selectedText === "News") {
      loadNews();
    } else if (selectedText === "Comments") {
      loadComments();
    }
  }, [selectedText]);

  
  if (!user) {
    return <h1>Loading..</h1>;
  }
  return (
    <div className="flex flex-col items-center w-full m-2">
      <div className=''>
        <p className='absolute top-4 left-6'>{user.name} ― {user.login}</p>
        <button onClick={() => navigate("/")}
          className="absolute top-4 right-6 bg-[#AD89BD] text-white px-4 py-2 rounded-full hover:bg-[#9a75ac] transition" >
            На головну
        </button>
      </div>
      

      <h1 className="mt-16">Hello admins</h1>
      <div className='flex space-x-6 m-10'>
        <button onClick={() => setSelectedText("Users")}>Users</button>
        <button onClick={() => setSelectedText("News")}>News</button>
        <button onClick={() => setSelectedText("Comments")}>Comments</button>
        <button onClick={() => setSelectedText("Reports")}>Reports</button>
      
      </div>
      <input className="border" type="search" placeholder="Пошук..." />
      <h1>{selectedText}</h1>

      <div className="w-full flex justify-center items-center min-h-screen">
      {/* Таблиця користувачів */}
      {selectedText === "Users" && users && users.length > 0 ? (
          <UserTable users={users} onCreate={OnCreateUser} onSave={OnSaveUserData} onDelete={OnDeleteUserData}/>
        ) : selectedText === "Users" ? (
          <p>Немає користувачів</p>
        ) : null
      }

      {/* Таблиця Новин */}
      {selectedText === "News" && news && news.length > 0 ? (
          <NewsTable 
            news={news} 
            onSave={OnSaveNewsData} 
            onDelete={OnDeleteNewsData}
            onCreate={OnCreateNews}
          />
        ) : selectedText === "News" ? (
          <p>Немає новин</p>
        ) : null
      }

      {/* Таблиця Коментарі */}
      {selectedText === 'Comments' && comments && comments.length > 0 ? (
          <CommentsTable 
            comments={comments} 
            onSave={OnSaveCommentsData} 
            onDelete={OnDeleteCommentsData}
            onCreate={OnCreateComment}
          />
        ) : selectedText === "Comments" ? (
          <p>Немає коментарів до дописів</p>
        ) : null
      }
      
      </div>
    </div>
  )
}

export default AdminPage