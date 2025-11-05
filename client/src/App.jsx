import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AdminPage from './pages/AdminPage.jsx';
import AuthorizationPage from './pages/AuthorizationPage.jsx'; 
import { UserProvider } from './context/UserContext.jsx';
import HomePage from './pages/HomePage.jsx';

const router = createBrowserRouter([
  {
    path: "",
    element: <HomePage/>,
  },
  {
    path: "admin",
    element: <AdminPage/>,
  },

  {
    path: "auth",
    element: <AuthorizationPage />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
