import { useState } from 'react';
import * as userService from '../../services/userService';
import styles from './UserForm.module.scss';
import { UserFormData } from '../../types/forms';
import { Role } from '../../types/enums';
import { User } from '../../types/models';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { TiCancel, TiPlus } from 'react-icons/ti';
import { TbEraser } from 'react-icons/tb';
import Button from '../Button/Button';
import ButtonContainer from '../ButtonContainer/ButtonContainer';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorOverlay from '../ErrorOverlay/ErrorOverlay';
import ErrorContainer from '../ErrorContainer/ErrorContainer';

interface UserFormProps {
  user?: User;
  setIsBeingEdited?: (boolean: boolean) => void;
}

const UserForm = (props: UserFormProps): JSX.Element => {
  const { user, setIsBeingEdited } = props;
  
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: (data: UserFormData) => userService.create(data),
    onSettled: () => {
      queryClient.invalidateQueries(['users']);
      handleClear();
    },
  });

  const updateUser = useMutation({
    mutationFn: (data: UserFormData) => userService.update(data.id, data),
    onMutate: async (updatedUser: UserFormData) => {
      await queryClient.cancelQueries(['users']);
      const previousUsers = queryClient.getQueryData<User[]>(['users']);
      previousUsers && queryClient.setQueryData(
        ['users'], 
        previousUsers.map(user => 
          user.id !== updatedUser.id ? user : updatedUser
        )
      );
      return previousUsers;
    },
    onError: (err, updatedUser, context) => {
      queryClient.setQueryData(['users'], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  const [message, setMessage] = useState<string>('');

  const formSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Email is invalid"),
    role: z.nativeEnum(Role),
  });

  const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserFormData>({
    defaultValues: {
      id: user ? user.id : 0,
      name: user ? user.name : '',
      email: user ? user.email : '',
      role: user ? user.role : Role.USER,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<UserFormData> = async data => {
    try {
      if (!user) {
        createUser.mutate(data);
      } else {
        setIsBeingEdited && setIsBeingEdited(false);
        updateUser.mutate(data);
      }
    } catch (err: any) {
      setMessage(err.message);
      console.log(err);
    }
  }

  const handleClear = () => reset();

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      {errors.name?.message && <ErrorContainer content={errors.name.message} />}
      <input placeholder="Name" {...register("name")} />
      {errors.email?.message && <ErrorContainer content={errors.email.message} />}
      <input placeholder="Email" {...register("email")} />
      <select {...register("role")}>
        {Object.values(Role).map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
      <ButtonContainer>
        <Button 
          disabled={isSubmitting} 
          icon={!isSubmitting && <TiPlus />}
          content={!isSubmitting ? 'Save' : 'Saving...'}
          accent 
        />
        {!user || !setIsBeingEdited ?
          <Button onClick={handleClear} icon={<TbEraser />} content="Clear" />
          :
          <Button onClick={() => setIsBeingEdited(false)} icon={<TiCancel />} content="Cancel" />
        }
      </ButtonContainer>
      {message && <ErrorOverlay setMessage={setMessage} content={message} />}
    </form>
  );
}

export default UserForm;