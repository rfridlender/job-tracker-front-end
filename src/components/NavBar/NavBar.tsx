import { NavLink } from 'react-router-dom';
import { Role } from '../../types/enums';
import { User } from '../../types/models';
import styles from './NavBar.module.scss';
import logo from '../../assets/icons/logo.png';
import thinLogo from '../../assets/icons/logo-thin.png'
import { TbPassword, TbLogout } from 'react-icons/tb'

interface NavBarProps {
  user: User | null;
  handleLogout: () => void;
}

const NavBar = (props: NavBarProps): JSX.Element => {
  const { user, handleLogout } = props;
  
  if (!user) {
    return (
      <nav className={styles.container}>
        <div className={styles.subnav}>
          <div>
            <img className={styles.logo} src={logo} alt="Door2Door Logo" />
            <img className={styles.thinLogo} src={thinLogo} alt="Door2Door Logo" />
          </div>
          <div>
            <NavLink 
              className={({ isActive }) => isActive ? styles.active : ''}
              to="/login"
            >
              Login
            </NavLink>
          </div>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className={styles.container}>
        <div className={styles.subnav}>
          <div>
            <img className={styles.logo} src={logo} alt="Door2Door Logo" />
            <img className={styles.thinLogo} src={thinLogo} alt="Door2Door Logo" />
            <NavLink 
              className={({ isActive }) => isActive ? styles.active : ''}
              to="/jobs"
            >
              Jobs
            </NavLink>
            {user.role === Role.ADMIN &&
              <NavLink 
                className={({ isActive }) => isActive ? styles.active : ''}
                to="/admin"
              >
                Admin
              </NavLink>
            }
          </div>
          <div>
            <NavLink 
              className={({ isActive }) => isActive ? styles.active : ''}
              to="/change-password"
            >
              <TbPassword />
              <span>Change Password</span>
            </NavLink>
            <NavLink 
              className={({ isActive }) => isActive ? styles.active : ''}
              to="/" onClick={handleLogout}
            >
              <TbLogout />
              <span>Logout</span>
            </NavLink>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
