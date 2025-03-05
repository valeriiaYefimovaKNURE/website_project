import React, { useState }from 'react'

function AdminPage() {
  const [selectedText, setSelectedText] = useState("")
  
  return (
    <div className="flex flex-col items-center w-full m-10">
      <h1 className=''>Hello admins</h1>
      <div className='flex space-x-6 m-10'>
        <button onClick={() => setSelectedText("Users")}>Users</button>
        <button onClick={() => setSelectedText("News")}>News</button>
        <button onClick={() => setSelectedText("Comments")}>Comments</button>
        <button onClick={() => setSelectedText("Reports")}>Reports</button>
      </div>
      <input type="search" placeholder="Пошук..." />
      <h1>{selectedText}</h1>
    </div>
  )
}

export default AdminPage