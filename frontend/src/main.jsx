import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import Productos from '@pages/Productos';
import SubProducto from '@pages/SubProducto';
import Vehiculos from '@pages/Vehiculos';
import Inventario from '@pages/Inventario';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';

const router = createBrowserRouter([
  {    
    path: '/',
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },      
      {
        path: '/productos',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Productos />
          </ProtectedRoute>
        ),
      },
      {
        path: '/vehiculos',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Vehiculos />
          </ProtectedRoute>
        ),
      },
      {
        path: '/subproductos',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <SubProducto />
          </ProtectedRoute>
        ),
      },
      {
        path: '/inventario',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Inventario />
          </ProtectedRoute>
        ),
      }
    ]
  },
  {
    path: '/auth',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)