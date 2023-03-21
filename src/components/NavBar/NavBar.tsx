import { NavLink } from 'react-router-dom';
import { Role } from '../../types/enums';
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
          <NavLink to="/jobs">Jobs</NavLink>
          {user.role === Role.ADMIN && <NavLink to="/admin">Admin</NavLink>}
          <NavLink to="/change-password">Change Password</NavLink>
          <NavLink to="" onClick={handleLogout}>Logout</NavLink>
        </div>
      :
        <div>
          <NavLink to="/login">Login</NavLink>
        </div>
      }
    </nav>
  );
}

export default NavBar;
