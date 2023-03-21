import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Landing from './pages/Landing/Landing';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import NavBar from './components/NavBar/NavBar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import * as authService from './services/authService';
import { User } from './types/models';
import JobsIndex from './pages/JobList/JobList';
import { Role } from './types/enums';
import Admin from './pages/Admin/Admin';

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
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login handleAuthEvt={handleAuthEvt} />}/>
        <Route
          path="/change-password"
          element={
            <ProtectedRoute user={user}>
              <ChangePassword handleAuthEvt={handleAuthEvt} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute user={user}>
              {user && <JobsIndex user={user} />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user}>
              {user?.role === Role.ADMIN && <Admin user={user} />}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App;