import { useState } from 'react'
import '../styles/HomePage.css'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function HomePage() {
  const {user}=useUser();
  const navigate=useNavigate();

  return (
    <>
    <header className='fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 z-50'>
      <div className='flex space-x-6'>
        <a>Me.We.Women</a>
        <a>Про додаток</a>
        <a>Топ</a>
        <a>Завантажити</a>
      </div>

      <img src="mepower_logo.png" className='mepower-logo'/>

      <div className='flex flex-row space-x-6 items-center'>
        <p className=''>{user?.name}</p>
        {user?(
          <button onClick={()=>navigate("/admin")}>Адмінська панель</button>
        ):(
          <button onClick={()=>navigate("/auth")}>Увійти</button>
        )}
      </div>
    </header>

    <main className='flex flex-col items-center justify-center h-screen pt-20 px-5'>
      <h1>Hello</h1>
    </main>
      
    </>
  )
}

export default HomePage
