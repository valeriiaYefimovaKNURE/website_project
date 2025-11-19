import app from '../../services/firebaseClient.config';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";

const auth=getAuth(app);

export const getAuthToken=async(email,password)=>{
    try{
        const userCred=await signInWithEmailAndPassword(auth, email,password);
        const token=await userCred.user.getIdToken();

        return token;
    }catch(error){
        console.log("auth.js / getAuthToken(): Помилка авторизації в Firebase Auth");
        throw error;
    }
}

export const createAuth=async(email,password)=>{
    try{
        const userCred=await createUserWithEmailAndPassword(auth, email, password);
        
        await sendEmailVerification(userCred.user,{
            url: 'https://localhost:5173/auth', // URL для редиректа после подтверждения
            handleCodeInApp: false
        });

        return userCred.user.uid;
    }catch(error){
        console.error("auth.js / createAuth():", error);
        throw error;
    }
}
export const resendEmailVerification=async()=>{
    try{
        const auth=getAuth();
        const user=auth.currentUser;
        if(user){
            await sendEmailVerification(user);
            alert("Лист відправлено повторно");
        } else {
          alert("Помилка: користувач не знайдений");
        }
    }catch(error){
        console.error("auth.js / resendEmailVerification(): Помилка відправки листа для підтвердження");
        throw error;
    }
}