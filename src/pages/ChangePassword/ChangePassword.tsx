import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import NavBar from '../../components/NavBar/NavBar';
import styles from './ChangePassword.module.scss';
import logo from '../../assets/icons/logo.png'

interface ChangePasswordProps {
  handleAuthEvt: () => void;
}

const ChangePassword = (props: ChangePasswordProps): JSX.Element => {
  return (
    <>
      <NavBar />
      <main className={styles.container}>
        <img src={logo} alt="Door2Door Logo" />
        <ChangePasswordForm {...props} />
      </main>
    </>
  );
}

export default ChangePassword;
