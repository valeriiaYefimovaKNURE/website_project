import { createContext, useContext, useState } from "react";

const UserContext=createContext(null);

export const UserProvider=({children})=>{
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    console.log("UserContext user:", user);
    return(
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser=()=>useContext(UserContext);