import { useState } from 'react';
import { Navigate } from 'react-router';
import LoginForm from '../../components/LoginForm/LoginForm';
import { User } from '../../types/models';
import styles from './Login.module.scss';

interface LoginPageProps {
  user: User | null;
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
        <h2>Please log in</h2>
        <LoginForm handleAuthEvt={handleAuthEvt} />
      </main>
    );
  }
}

export default LoginPage;