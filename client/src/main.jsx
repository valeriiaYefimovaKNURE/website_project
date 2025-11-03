import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AdminPage from './pages/AdminPage.jsx';
import AuthorizationPage from './pages/AuthorizationPage.jsx'; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
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
    <RouterProvider router={router} />
  </StrictMode>,
)
