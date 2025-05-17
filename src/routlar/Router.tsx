import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Xodimlar from '../pages/Xodimlar'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'   
import Mijozlar from '../pages/Mijozlar'
import Smenalar from '../pages/Smenalar'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
          {
            index: true,             
            element: <Dashboard />   
          },
          {
            path: 'dashboard',       
            element: <Dashboard />
          },
          {
            path: 'xodimlar',
            element: <Xodimlar />
          },
          {
            path: 'mijozlar',
            element: <Mijozlar />
          },
          {
            path: 'smenalar',
            element: <Smenalar />
          }
        ]
      },
      {
        path: '/login',
        element: <Login />
      }
    ])

export default router
