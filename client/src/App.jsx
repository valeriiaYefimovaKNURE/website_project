import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

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

      <div>
        <Link to="/auth">
          <button>Увійти</button>
        </Link>
      </div>
    </header>

    <main className='flex flex-col items-center justify-center h-screen pt-20 px-5'>
      <h1>Hello</h1>
    </main>
      
    </>
  )
}

export default App
