import { NavLink } from 'react-router-dom';
import { User } from '../../types/models';
import styles from './NavBar.module.scss';

interface NavBarProps {
  user: User | null;
  handleLogout: () => void;
}

const NavBar = (props: NavBarProps): JSX.Element => {
  const { user, handleLogout } = props;
  
  return (
    <nav className={styles.container}>
      {user ?
        <div>
          <NavLink to="/change-password">Change Password</NavLink>
          <NavLink to="" onClick={handleLogout}>LOG OUT</NavLink>
        </div>
      :
        <div>
          <NavLink to="/login">Log In</NavLink>
          <NavLink to="/signup">Sign Up</NavLink>
        </div>
      }
    </nav>
  );
}

export default NavBar;
