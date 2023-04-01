import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login/Login';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import * as authService from './services/authService';
import { User } from './types/models';
import { Role } from './types/enums';
import AdminRoute from './components/AdminRoute/AdminRoute';
import JobList from './components/JobList/JobList';
import ContractorList from './components/ContractorList/ContractorList';
import UserList from './components/UserList/UserList';
import NavBar from './components/NavBar/NavBar';
import SideBar from './components/SideBar/SideBar';

const App = (): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  
  const handleLogout = (): void => {
    authService.logout();
    setUser(null);
    navigate('/');
  }

  const handleAuthEvt = (): void => {
    setUser(authService.getUser());
  }

  return (
    <>
      {isSideBarOpen && pathname !== '/change-password' && user && <SideBar user={user} />}
      <div id="container">
        <NavBar 
          user={user} handleLogout={handleLogout} 
          isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} 
        />
        <Routes>
          <Route path="/" element={<Login user={user} handleAuthEvt={handleAuthEvt} />} />
          <Route path="/change-password" element={
              <ProtectedRoute user={user}>
                {user && <ChangePassword handleAuthEvt={handleAuthEvt} />}
              </ProtectedRoute>
            }
          />
          <Route path="/jobs" element={
              <ProtectedRoute user={user}>
                {user && <JobList user={user} />}
              </ProtectedRoute>
            }
          />
          <Route path="/builders" element={
              <AdminRoute user={user}>
                {user?.role === Role.ADMIN && <ContractorList />}
              </AdminRoute>
            }
          />
          <Route path="/users" element={
              <AdminRoute user={user}>
                {user?.role === Role.ADMIN && <UserList />}
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;