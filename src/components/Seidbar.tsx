
import { NavLink } from 'react-router-dom'
import { FaUsers, FaUser, FaClock } from 'react-icons/fa'
import dark from '../assets/logodark.svg'

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-[250px] bg-[#1e1e2f] text-white p-6 shadow-lg flex flex-col justify-between">
      <div>
        <NavLink to={'/'}>
          <img src={dark} alt="logo" className="mb-6 w-[206px] bg-gray-500 py-3 px-6 rounded-lg" />
        </NavLink>
        <ul className="space-y-4 text-lg">
          <li>
            <NavLink
              to="/xodimlar"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded text-[15px] cursor-pointer transition hover:bg-[#2e2e3f] ${
                  isActive ? 'bg-[#3a3a55]' : ''
                }`
              }
            >
              <FaUsers /> Hodimlar ro'yxati
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mijozlar"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded text-[15px] cursor-pointer transition hover:bg-[#2e2e3f] ${
                  isActive ? 'bg-[#3a3a55]' : ''
                }`
              }
            >
              <FaUser /> Mijozlar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/smenalar"
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded text-[15px] cursor-pointer transition hover:bg-[#2e2e3f] ${
                  isActive ? 'bg-[#3a3a55]' : ''
                }`
              }
            >
              <FaClock /> Smenalar
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="pt-6 border-t border-[#333]">
        <NavLink
          to="/login"
          className="block w-full text-center py-2 bg-red-600 hover:bg-red-700 rounded transition "
        >
          Chiqish
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
