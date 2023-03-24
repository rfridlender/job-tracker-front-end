import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import styles from './ChangePassword.module.scss';

interface ChangePasswordProps {
  handleAuthEvt: () => void;
}

const ChangePassword = (props: ChangePasswordProps): JSX.Element => {
  return (
    <main className={styles.container}>
      <h2>Change Password</h2>
      <ChangePasswordForm {...props} />
    </main>
  );
}

export default ChangePassword;
