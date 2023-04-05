import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import * as authService from '../../services/authService';
import { AuthFormProps } from '../../types/props';
import { LoginFormData } from '../../types/forms';
import logo from '../../assets/icons/white-icon.png';
import { SubmitHandler, useForm } from 'react-hook-form';
import ErrorContainer from '../ErrorContainer/ErrorContainer';
import ErrorOverlay from '../ErrorOverlay/ErrorOverlay';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';

const LoginForm = (props: AuthFormProps): JSX.Element => {
  const { handleAuthEvt } = props;

  const navigate = useNavigate();

  const [message, setMessage] = useState<string>('');

  const formSchema = z.object({
    email: z.string().min(1, "Email is required").email("Email is invalid"),
    password: z.string().min(1, "Password is required"),
  });

  const { 
    register, handleSubmit, formState: { errors, isSubmitting, isDirty },
  } = useForm<LoginFormData>({ resolver: zodResolver(formSchema) });

  const onSubmit: SubmitHandler<LoginFormData> = async data => {
    try {
      await authService.login(data);
      handleAuthEvt();
      navigate('/jobs');
    } catch (err: any) {
      setMessage(err.message);
      console.log(err);
    }
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <h2>Log in</h2>
      {errors.email?.message && <ErrorContainer content={errors.email.message} />}
      <Input name="email" register={register} placeholder="Email" />
      {errors.password?.message && <ErrorContainer content={errors.password.message} />}
      <Input type="password" name="password" register={register} placeholder="Password" />
      <Button 
        disabled={!isDirty || isSubmitting}
        icon={<img src={logo} alt="Door2Door Logo" />} 
        content={!isSubmitting ? "Log In" : "Logging in..."}
        accent
      />
      {message && <ErrorOverlay setMessage={setMessage} content={message} />}
    </form>
  );
}

export default LoginForm;