import { Navigate } from 'react-router';
import LoginForm from '../../components/LoginForm/LoginForm';
import NavBar from '../../components/NavBar/NavBar';
import { User } from '../../types/models';
import styles from './Login.module.scss';
import logo from '../../assets/icons/logo.png';

interface LoginPageProps {
  user?: User | null;
  handleAuthEvt: () => void;
} 

const LoginPage = (props: LoginPageProps): JSX.Element => {
  const { user, handleAuthEvt } = props;

  if (user) {
    return (
      <Navigate to="/jobs" />
    );
  } else {
    return (
      <main className={styles.container}>
        <img src={logo} alt="Door2Door Logo" />
        <LoginForm handleAuthEvt={handleAuthEvt} />
      </main>
    );
  }
}

export default LoginPage;