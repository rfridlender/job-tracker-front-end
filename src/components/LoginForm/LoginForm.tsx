import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import * as authService from '../../services/authService';
import { AuthFormProps } from '../../types/props';
import { LoginFormData } from '../../types/forms';
import { handleErrMsg } from '../../types/validators';
import logo from '../../assets/icons/white-icon.png';

const LoginForm = (props: AuthFormProps): JSX.Element => {
  const { handleAuthEvt } = props;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    try {
      await authService.login(formData);
      handleAuthEvt();
      navigate('/portal/jobs');
    } catch (err) {
      console.log(err);
      handleErrMsg(err, setMessage);
    }
  }

  const { email, password } = formData;

  const isFormInvalid = (): boolean => {
    return !(email && password);
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <h2>Log in</h2>
      {message && <div className={styles.message}>{message}</div>}
      <input
        className={styles.inputContainer} type="email" id="email" 
        value={email} name="email" onChange={handleChange} placeholder="Email"
      />
      <input
        className={styles.inputContainer} type="password" id="password" 
        value={password} name="password" onChange={handleChange} placeholder="Password"
      />
      <div className={styles.buttonContainer}>
        <button disabled={isFormInvalid()}>
          <img src={logo} alt="Door2Door Logo" />
          <span>Log In</span>
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
