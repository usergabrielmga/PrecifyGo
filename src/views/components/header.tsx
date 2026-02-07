import logo from '../../imgs/logo.png';
import Profile from '../../imgs/profile.png';

export default function Header() {
  return (
    <header className='h-20 background-black flex items-center shadow-md mb-10'>
      <div className=''>
        <img className='width-35 h-35' src={logo} alt="Logo PrecifyGo" />
      </div>

      <div className='absolute right-10 cursor-pointer'>
        <img className='width-12 h-12' src={Profile} alt="Profile" />
      </div>
    </header>
  )
}