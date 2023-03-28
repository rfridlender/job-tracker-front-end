import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import * as authService from './services/authService';
import { User } from './types/models';
import { Role } from './types/enums';
import AdminRoute from './components/AdminRoute/AdminRoute';
import Portal from './pages/Portal/Portal';
import JobList from './components/JobList/JobList';
import ContractorList from './components/ContractorList/ContractorList';
import UserList from './components/UserList/UserList';

const App = (): JSX.Element => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(authService.getUser());
  
  const handleLogout = (): void => {
    authService.logout();
    setUser(null);
    navigate('/');
  }

  const handleAuthEvt = (): void => {
    setUser(authService.getUser());
  }

  return (
    <Routes>
      <Route path="/" element={<Login handleAuthEvt={handleAuthEvt} />} />
      <Route
        path="change-password"
        element={
          <ProtectedRoute user={user}>
            <ChangePassword handleAuthEvt={handleAuthEvt} />
          </ProtectedRoute>
        }
      />
      <Route 
        path="portal" 
        element={
          <ProtectedRoute user={user}>
            {user && <Portal user={user} handleLogout={handleLogout} />}
          </ProtectedRoute>
        }
      >
        <Route
          path="jobs"
          element={
            <ProtectedRoute user={user}>
              {user && <JobList user={user} />}
            </ProtectedRoute>
          }
        />
        <Route
          path="builders"
          element={
            <AdminRoute user={user}>
              {user?.role === Role.ADMIN && <ContractorList />}
            </AdminRoute>
          }
        />
        <Route
          path="users"
          element={
            <AdminRoute user={user}>
              {user?.role === Role.ADMIN && <UserList />}
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;