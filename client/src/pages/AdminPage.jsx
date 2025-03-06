import React, { useEffect, useState }from 'react'
import axios from "axios"

function AdminPage() {
  const [selectedText, setSelectedText] = useState("")
  const [users, setUsers] = useState([]);

  const fetchAPI=async()=>{
    try {
      const userInfo=await axios.get("http://localhost:8080/users");
      setUsers(userInfo.data)
    } catch (error) {
      console.error("AdminPage / Помилка при завантаженні даних про користувачів з сервера:", error);
    }
  }
  useEffect(()=>{
    if(selectedText==="Users"){
      fetchAPI();
    }
  },[selectedText])

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

      <div className="flex justify-center items-center min-h-screen">
      {/* Таблица пользователей */}
      {selectedText === "Users" && users && Object.keys(users).length > 0 ? (
        <table className="border-collapse border border-gray-400 w-full mt-5 table-fixed">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2 w-10">#</th>
              <th className="border border-gray-400 p-2 w-16 truncate overflow-hidden text-ellipsis">ID</th>
              <th className="border border-gray-400 p-2 w-15">Фото</th>
              <th className="border border-gray-400 p-2 w-32">Ім'я</th>
              <th className="border border-gray-400 p-2 w-32">Логін</th>
              <th className="border border-gray-400 p-2 w-48">Email</th>
              <th className="border border-gray-400 p-2 w-24">Дата народження</th>
              <th className="border border-gray-400 p-2 w-16">Стать</th>
              <th className="border border-gray-400 p-2 w-15">Роль</th>
              <th className="border border-gray-400 p-2 w-10 truncate overflow-hidden text-ellipsis">Пароль</th>
              <th className="border border-gray-400 p-2 w-10 truncate overflow-hidden text-ellipsis">Viper</th>
              <th className="border border-gray-400 p-2 w-10">Terms</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(users).map(([id, user], index) => (
              <tr key={id} className="hover:bg-gray-100">
                <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                <td className="border border-gray-400 p-2 text-center w-16 truncate overflow-hidden text-ellipsis">{user.uid}</td>
                <td className="border border-gray-400 p-2 text-center">
                  <img src={user.imageUri} alt={user.name} className="w-10 h-10 rounded-full mx-auto" />
                </td>
                <td className="border border-gray-400 p-2">{user.name}</td>
                <td className="border border-gray-400 p-2">{user.login}</td>
                <td className="border border-gray-400 p-2">{user.email}</td>
                <td className="border border-gray-400 p-2">{user.birthday}</td>
                <td className="border border-gray-400 p-2">{user.gender}</td>
                <td className="border border-gray-400 p-2">{user.role}</td>
                <td className="border border-gray-400 p-2 w-10 truncate overflow-hidden text-ellipsis">{user.password}</td>
                <td className="border border-gray-400 p-2 w-10 truncate overflow-hidden text-ellipsis">{user.viper}</td>
                <td className="border border-gray-400 p-2">{user.hasAgreedToTerms ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedText === "Users" ? (
        <p>Нет пользователей</p>
      ) : null}
      </div>
    </div>
  )
}

export default AdminPage