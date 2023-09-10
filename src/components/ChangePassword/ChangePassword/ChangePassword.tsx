import ChangePasswordForm from '../ChangePasswordForm/ChangePasswordForm';
import styles from './ChangePassword.module.scss';
import logo from '../../../assets/icons/logo.png'

interface ChangePasswordProps {
  handleAuthEvt: () => void;
}

const ChangePassword = (props: ChangePasswordProps): JSX.Element => {
  return (
    <main className={styles.container}>
      <img src={logo} alt="Door2Door Logo" />
      <ChangePasswordForm {...props} />
    </main>
  );
}

export default ChangePassword;
