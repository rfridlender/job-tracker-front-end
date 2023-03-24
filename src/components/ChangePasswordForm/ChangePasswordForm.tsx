import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import styles from './ChangePasswordForm.module.scss';
import { AuthFormProps } from '../../types/props';
import { ChangePasswordFormData } from '../../types/forms';
import { handleErrMsg } from '../../types/validators';
import logo from '../../assets/icons/logo.png';

const ChangePasswordForm = (props: AuthFormProps): JSX.Element => {
  const { handleAuthEvt } = props;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ChangePasswordFormData>({
    oldPassword: '',
    newPassword: '',
    newPasswordConf: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    try {
      await authService.changePassword(formData);
      handleAuthEvt();
      navigate('/jobs');
    } catch (err) {
      console.log(err);
      handleErrMsg(err, setMessage);
    }
  }

  const { oldPassword, newPassword, newPasswordConf } = formData;

  const isFormInvalid = (): boolean => {
    return !(oldPassword && newPassword && newPassword === newPasswordConf);
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <img src={logo} alt="Door2Door Logo" />
      <div className={styles.message}>{message}</div>
      <input 
        className={styles.inputContainer} type="password" id="oldPassword" 
        value={oldPassword} name="oldPassword" onChange={handleChange} 
        placeholder="Current Password"
      />
      <input 
        className={styles.inputContainer} type="password" id="newPassword" 
        value={newPassword} name="newPassword" onChange={handleChange} 
        placeholder="New Password"
      />
      <input 
        className={styles.inputContainer} type="password" id="newPasswordConf" 
        value={newPasswordConf} name="newPasswordConf" onChange={handleChange} placeholder="Confirm New Password"
      />
      <div className={styles.buttonContainer}>
        <button disabled={isFormInvalid()}>Apply</button>
        <div><Link to="/jobs">Cancel</Link></div>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
