import '../styles/NavBar.scss';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar'>
        <Link to="/"><div>Home</div></Link>
        <Link to="/asset-management"><div>Asset Management</div></Link>
    </nav>
  );
};

export default Navbar;