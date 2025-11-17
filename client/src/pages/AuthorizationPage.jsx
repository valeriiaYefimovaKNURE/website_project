import { useState } from "react";
import { createAuth, getAuthToken, resendEmailVerification } from "../utils/auth";
import { useUser } from "../context/UserContext";
import { validateForm, validateLoginForm } from "../utils/formValidation";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function AuthorizationPage() {
  const {setUser}=useUser();
  const navigate=useNavigate();
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Signup
  const [isSubmitting, setSubmitting]=useState(false);
  const [message, setMessage]=useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailForVerify, setEmailForVerify] = useState("");
  const [form,setForm]=useState({
    email:'',
    password:'',
    name:'',
    login:''
  });

  const submitLogin=async(e)=>{
    e.preventDefault();

    const validation=validateLoginForm(form);
    if(!validation.valid){
      setMessage(validation.message);
      return;
    }
    setSubmitting(true);
    try{
      const userToken=await getAuthToken(form.email, form.password);
      const res=await fetch("http://localhost:8080/login",{
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({userToken})
      });
      const data=await res.json();

      if(!res.ok) throw new Error("Login failed");

      setUser(data);
      navigate("/admin")
    }catch(error){
      console.error(error);
      setMessage("Виникла помилка при вході :(")
    }finally{
      setSubmitting(false);
    }
  }

  const submitSignup=async(e)=>{
    e.preventDefault();

    const validation=validateForm(form);
    if(!validation.valid){
      setMessage(validation.message);
      return;
    }

    setSubmitting(true);
    try{
      await createAuth(form.email,form.password);
      setEmailForVerify(form.email);
      setEmailSent(true)
      
      setMessage(data.message);
    }catch(error){
      setMessage("Виникла помилка :(")
    }finally{
      setSubmitting(false);
    }
  }
  const confirmVerified=async()=>{
    try{
      const res=await fetch("http://localhost:8080/complete-registration",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailForVerify,
          name: form.name,
          login: form.login
        })
      })
      const data = await res.json();
      setUser(form);

      if (data.success) {
        alert("✅ Реєстрація завершена!");
        setUser(form);
        setIsLogin(true);
        navigate("/admin")
      } else {
        alert("⚠️ Пошта не підтверджена. Спробуйте пізніше.");
      } 
    }
    catch(error){
      console.error(error);
      alert("Помилка при підтвердженні");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  font-poppins px-20">

      <BackButton to="/" /> 
      <div className="bg-white rounded-2xl p-20 w-full max-w-[800px] shadow-2xl">
        
        <h2 className="text-3xl font-semibold text-center mb-11">
          {isLogin ? "Вхід" : "Реєстрація"}
        </h2>

        {/* Форми */}
        {!isLogin && emailSent ? (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">Підтвердіть вашу пошту</h2>
            <p className="text-gray-600">
              Ми надіслали листа на {emailForVerify}.  
              Перейдіть за посиланням та натисніть кнопку нижче 👇
            </p>

            <button
              className="bg-green-600 text-white py-2 w-full rounded-md"
              onClick={confirmVerified}
            >
              Підтверджено
            </button>

            <button
              className="text-blue-600 underline mt-2"
              onClick={resendEmailVerification}
            >
              Надіслати ще раз
            </button>
          </div>
        ) :isLogin ? (
          <form className="flex flex-col space-y-5 w-full min-w-[18rem] ">
            {message && (
              <p className="text-2xl font-semibold text-center mb-6" >{message}</p>
            )}
            <input
              type="text"
              placeholder="Email"
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e)=>setForm({...form,email:e.target.value})}
              value={form.email}
            />
            <input
              type="password"
              placeholder="Пароль"
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e)=>setForm({...form,password:e.target.value})}
              value={form.password}
            />
            <div className="text-right">
              <a href="#" className="text-blue-600 hover:underline">
                Забули пароль?
              </a>
            </div>
            <button className="bg-blue-600 text-white py-2 rounded-md hover:opacity-90 transition"
              onClick={submitLogin}
            >
              {isSubmitting ? "Завантаження..." : "Увійти"}
            </button>
            <div className="text-center mt-2 text-gray-700 flex flex-row items-center justify-center mt-6">
               Не маєте акаунт?{" "}
              <a
                className="text-blue-600 hover:underline font-medium ml-2"
                onClick={() => setIsLogin(false)}
              >
                Реєстрація
              </a>
            </div>
          </form>
        ) : (
          <form className="flex flex-col space-y-5 w-full min-w-[18rem]">
            <input
              type="text"
              placeholder="Ім'я"
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e)=>setForm({...form,name:e.target.value})}
              value={form.name}
            />
            <input
              type="text"
              placeholder="Логін"
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 "
              onChange={(e)=>setForm({...form,login:e.target.value})}
              value={form.login}
            />
            <input
              type="text"
              placeholder="Email"
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 "
              onChange={(e)=>setForm({...form,email:e.target.value})}
              value={form.email}
            />
            <input
              type="password"
              placeholder="Пароль"
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e)=>setForm({...form,password:e.target.value})}
              value={form.password}
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:opacity-90 transition"
              onClick={submitSignup}
            >
              {isSubmitting ? "Завантаження..." : "Зареєструватися"}
            </button>
            <div className="text-center mt-5 text-gray-700 flex flex-row items-center justify-center ">
              Вже маєте акаунт?{" "}
              <a
                className="text-blue-600 hover:underline font-medium ml-2"
                onClick={() => setIsLogin(true)}
              >
                Увійти
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}