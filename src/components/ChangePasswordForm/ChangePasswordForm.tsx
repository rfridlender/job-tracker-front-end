import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import styles from './ChangePasswordForm.module.scss';
import { AuthFormProps } from '../../types/props';
import { ChangePasswordFormData } from '../../types/forms';
import BigButton from '../BigButton/BigButton';

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
    }
  }

  const { oldPassword, newPassword, newPasswordConf } = formData;

  const isFormInvalid = (): boolean => {
    return !(oldPassword && newPassword && newPassword === newPasswordConf);
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <h2>Change password</h2>
      {message && <div className={styles.message}>{message}</div>}
      <input 
        type="password" value={oldPassword} name="oldPassword" 
        onChange={handleChange} placeholder="Current Password"
      />
      <input 
        type="password" value={newPassword} name="newPassword" 
        onChange={handleChange} placeholder="New Password"
      />
      <input 
        type="password" value={newPasswordConf} name="newPasswordConf" 
        onChange={handleChange} placeholder="Confirm New Password"
      />
      <div className={styles.buttonContainer}>
        <BigButton disabled={isFormInvalid()} content="Apply" accent />
        <BigButton onClick={() => navigate('/jobs')} content="Cancel" />
      </div>
    </form>
  );
}

export default ChangePasswordForm;
