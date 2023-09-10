import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../../services/authService';
import styles from './ChangePasswordForm.module.scss';
import { AuthFormProps } from '../../../types/props';
import { ChangePasswordFormData } from '../../../types/forms';
import Button from '../../UI/Button/Button';
import ButtonContainer from '../../UI/ButtonContainer/ButtonContainer';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MessageOverlay from '../../UI/MessageOverlay/MessageOverlay';
import ErrorContainer from '../../UI/ErrorContainer/ErrorContainer';
import Input from '../../UI/Input/Input';

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
    register, handleSubmit, formState: { errors, isSubmitting, isDirty },
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
      <Input type="password" name="oldPassword" register={register} placeholder="Current Password" />
      {errors.newPassword?.message && <ErrorContainer content={errors.newPassword.message} />}
      <Input type="password" name="newPassword" register={register} placeholder="New Password" />
      {errors.newPasswordConf?.message && 
        <ErrorContainer content={errors.newPasswordConf.message} />
      }
      <Input type="password" name="newPasswordConf" register={register} placeholder="Confirm Password" />
      <ButtonContainer>
        <Button disabled={!isDirty || isSubmitting} content={!isSubmitting ? 'Apply' : 'Applying...'} accent />
        <Button onClick={() => navigate('/jobs')} content="Cancel" />
      </ButtonContainer>
      {message && <MessageOverlay setMessage={setMessage} content={message} error />}
    </form>
  );
}

export default ChangePasswordForm;
