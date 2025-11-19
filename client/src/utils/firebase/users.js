// users.js
import axios from "axios";
import { createAuth } from "./auth";

export const fetchUsers = async () => {
    try {
      const userInfo = await axios.get("https://localhost:8080/users");
      return userInfo.data;
    } catch (error) {
      console.error("AdminPage / Помилка при завантаженні користувачів:", error);
      return [];
    }
  };

export const createUser=async(userData)=>{
    try {
      const userId=await createAuth(userData.email,"123456");

      const response = await fetch("https://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userData, userId}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Помилка при створенні користувача");
      }
    } catch (error) {
      console.error("createUser:", error.message);
      throw error;
    }
}

export const handleSaveUserData=async(row, updatedFields)=>{
    try{
      const userId=row.id;
      if (!userId) throw new Error("Немає ID користувача(-ки) для оновлення");

      const response=await fetch(`https://localhost:8080/users/${userId}`,{
        method:"PUT",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify(updatedFields)
      })

      if(!response.ok) throw new Error("Виникла помилка при оновленні даних користувача");
      console.log(response);

    }catch(error){
      console.error("handleSaveUserData(): Помилка при збереженні даних користувача:", error.message);
      throw error;
    }
}

export const handleDeleteUserData = async (userId) => {
    try {
      const response = await fetch(`https://localhost:8080/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Помилка при видаленні користувача");
    } catch (error) {
      console.error("handleDeleteUserData():", error.message);
      throw error;
    }
  };