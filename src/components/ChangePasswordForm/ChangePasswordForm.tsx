import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import styles from './ChangePasswordForm.module.scss';
import { AuthFormProps } from '../../types/props';
import { ChangePasswordFormData } from '../../types/forms';
import Button from '../Button/Button';
import ButtonContainer from '../ButtonContainer/ButtonContainer';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorOverlay from '../ErrorOverlay/ErrorOverlay';
import ErrorContainer from '../ErrorContainer/ErrorContainer';

const ChangePasswordForm = (props: AuthFormProps): JSX.Element => {
  const { handleAuthEvt } = props;

  const navigate = useNavigate();

    const formSchema = z
      .object({
        oldPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(1, "New password is required"),
        newPasswordConf: z.string().min(1, "Confirmation is required"),
      })
      .refine(data => data.newPassword === data.newPasswordConf, {
        path: ["newPasswordConf"],
        message: "New passwords do not match",
      });

  const { 
    register, handleSubmit, formState: { errors, isSubmitting } 
  } = useForm<ChangePasswordFormData>({ resolver: zodResolver(formSchema) });

  const [message, setMessage] = useState('');

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async data => {
    try {
      await authService.changePassword(data);
      handleAuthEvt();
      navigate('/jobs');
    } catch (err: any) {
      setMessage(err.message);
      console.log(err);
    }
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}  className={styles.container}>
      <h2>Change password</h2>
      {errors.oldPassword?.message && <ErrorContainer content={errors.oldPassword.message} />}
      <input type="password" placeholder="Current Password" {...register("oldPassword")} />
      {errors.newPassword?.message && <ErrorContainer content={errors.newPassword.message} />}
      <input type="password" placeholder="New Password" {...register("newPassword")} />
      {errors.newPasswordConf?.message && <ErrorContainer content={errors.newPasswordConf.message} />}
      <input type="password" placeholder="Confirm Password" {...register("newPasswordConf")} />
      <ButtonContainer>
        <Button disabled={isSubmitting} content={!isSubmitting ? 'Apply' : 'Applying...'} accent />
        <Button onClick={() => navigate('/jobs')} content="Cancel" />
      </ButtonContainer>
      {message && <ErrorOverlay setMessage={setMessage} content={message} />}
    </form>
  );
}

export default ChangePasswordForm;
