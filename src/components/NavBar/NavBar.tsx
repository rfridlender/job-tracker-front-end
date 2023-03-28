import { NavLink } from 'react-router-dom';
import { Role } from '../../types/enums';
import { User } from '../../types/models';
import styles from './NavBar.module.scss';
import { TbPassword, TbLogout } from 'react-icons/tb'
import { AiOutlineVerticalLeft, AiOutlineRight } from 'react-icons/ai';
import { CgMoveLeft, CgMoveRight } from 'react-icons/cg';

interface NavBarProps {
  user?: User | null;
  handleLogout?: () => void;
  isSideBarOpen?: boolean;
  setIsSideBarOpen?: (boolean: boolean) => void; 
}

const NavBar = (props: NavBarProps): JSX.Element => {
  const { user, handleLogout, isSideBarOpen, setIsSideBarOpen } = props;
  
  if (!user || !setIsSideBarOpen) {
    return (
      <nav className={styles.container} />
    );
  } else {
    return (
      <nav className={styles.container}>
        <div className={styles.welcomeContainer}>
          {isSideBarOpen ?
            <CgMoveLeft onClick={() => setIsSideBarOpen(false)} />
            :
            <CgMoveRight onClick={() => setIsSideBarOpen(true)} />
          }
          <span>Welcome, {user.name}</span>
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
      </nav>
    );
  }
}

export default NavBar;
