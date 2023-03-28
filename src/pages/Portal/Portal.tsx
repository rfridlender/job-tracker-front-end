import { Outlet } from 'react-router';
import { User } from '../../types/models';
import NavBar from '../../components/NavBar/NavBar';
import SideBar from '../../components/SideBar/SideBar';
import styles from './Portal.module.scss';
import { useState } from 'react';

interface PortalProps {
  user: User;
  handleLogout: () => void;
}

const Portal = (props: PortalProps): JSX.Element => {
  const { user, handleLogout } = props;

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  
  if (isSideBarOpen) {
    return (
      <div className={styles.container}>
        <NavBar 
          user={user}
          handleLogout={handleLogout} 
          isSideBarOpen={isSideBarOpen} 
          setIsSideBarOpen={setIsSideBarOpen} 
        />
        <SideBar user={user} />
        <Outlet />
      </div>
    );
  } else {
    return (
      <div className={styles.closedContainer}>
        <NavBar user={user} handleLogout={handleLogout} setIsSideBarOpen={setIsSideBarOpen} />
        <Outlet />
      </div>
    );
  }
}

export default Portal;