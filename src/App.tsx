// import { Outlet } from "react-router-dom"
// import Navbar from "./components/Navbar"
// import Seidbar from "./components/Seidbar"
// import Footer from "./components/Footer"

// function App() {
//   return (
//     <div style={{ display: 'flex', minHeight: '100vh' }}>
//       <Seidbar />
//       <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//         <Navbar />
//         <main style={{ flex: 1, padding: '1rem' }}>
//           <Outlet />
//         </main>
//         <Footer />
//       </div>
//     </div>


//   )
// }

// export default App


import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Seidbar from './components/Seidbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Seidbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '1rem' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
