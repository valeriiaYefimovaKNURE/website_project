import { useState } from "react";

export default function AuthorizationPage() {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Signup

  return (
    <div className="min-h-screen flex items-center justify-center  font-poppins">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl">
        
        {/* Заголовок */}
        <h2 className="text-3xl font-semibold text-center mb-6">
          {isLogin ? "Вхід" : "Реєстрація"}
        </h2>

        {/* Форми */}
        {isLogin ? (
          <form className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Email"
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Пароль"
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="text-right">
              <a href="#" className="text-blue-600 hover:underline">
                Забули пароль?
              </a>
            </div>
            <button className="bg-blue-600 text-white py-2 rounded-md hover:opacity-90 transition">
              Увійти
            </button>
            <div className="text-center mt-2 text-gray-700">
               Не маєте акаунт?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium"
                onClick={() => setIsLogin(false)}
              >
                Реєстрація
              </button>
            </div>
          </form>
        ) : (
          <form className="flex flex-col space-y-7 space-x-20 w-full">
            <input
              type="text"
              placeholder="Ім'я"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 "
            />
            <input
              type="text"
              placeholder="Email"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 "
            />
            <input
              type="password"
              placeholder="Пароль"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:opacity-90 transition">
              Зареєструватися
            </button>
            <div className="text-center mt-2 text-gray-700">
              Вже маєте акаунт?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium"
                onClick={() => setIsLogin(true)}
              >
                Увійти
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}