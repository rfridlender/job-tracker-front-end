import { NavLink } from 'react-router-dom';
import { Role } from '../../types/enums';
import { User } from '../../types/models';
import styles from './SideBar.module.scss';
import logo from '../../assets/icons/logo-white.png';
import icon from '../../assets/icons/icon-white.png';
import { BsFillHousesFill, BsFillPeopleFill } from 'react-icons/bs';
import { IoConstruct } from 'react-icons/io5';

interface SideBarProps {
  user: User;
}

const SideBar = (props: SideBarProps): JSX.Element => {
  const { user } = props;
  
  return (
    <nav className={styles.container}>
      <img className={styles.logo} src={logo} alt="Door2Door Logo" />
      <img className={styles.icon} src={icon} alt="Door2Door Icon" />
      <div className={styles.links}>
        <NavLink 
          className={({ isActive }) => isActive ? styles.active : ''}
          to="/portal/jobs"
        >
          <div className={styles.spacer} />
          <div className={styles.link}>
            <BsFillHousesFill />
            <span>Jobs</span>
          </div>
        </NavLink>
        {user.role === Role.ADMIN &&
          <>
            <NavLink 
              className={({ isActive }) => isActive ? styles.active : ''}
              to="/portal/builders"
            >
              <div className={styles.spacer} />
              <div className={styles.link}>
                <IoConstruct />
                <span>Builders</span>
              </div>
            </NavLink>
            <NavLink 
              className={({ isActive }) => isActive ? styles.active : ''}
              to="/portal/users"
            >
              <div className={styles.spacer} />
              <div className={styles.link}>
                <BsFillPeopleFill />
                <span>Users</span>
              </div>
            </NavLink>
          </>
        } 
      </div>
    </nav>
  );
}

export default SideBar;
