
import { FaSearch } from 'react-icons/fa'
import avatar from '../assets/avatar.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const user = {
    avatar: avatar,
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-300 fixed top-0 left-[250px] right-0 z-10">
      {/* Qidiruv */}
      <div className="flex items-center gap-2 w-full max-w-md mx-auto bg-gray-100 px-3 py-2 rounded-xl">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Qidiruv..."
          className="bg-transparent w-full focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3 border border-gray-500 rounded-full">
        <Link to="/">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-contain"
          />
        </Link>
      </div>
    </div>
  )
}

export default Navbar
