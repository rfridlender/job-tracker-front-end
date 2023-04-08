import { useState } from 'react';
import * as userService from '../../../services/userService';
import styles from './UserForm.module.scss';
import selectStyles from '../../UI/Select/Select.module.scss';
import { UserFormData } from '../../../types/forms';
import { Role } from '../../../types/enums';
import { User } from '../../../types/models';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { TiCancel, TiPlus } from 'react-icons/ti';
import { TbEraser } from 'react-icons/tb';
import Button from '../../UI/Button/Button';
import ButtonContainer from '../../UI/ButtonContainer/ButtonContainer';
import { Controller, SubmitHandler, useController, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MessageOverlay from '../../UI/MessageOverlay/MessageOverlay';
import ErrorContainer from '../../UI/ErrorContainer/ErrorContainer';
import Input from '../../UI/Input/Input';
import Select, { SingleValue } from 'react-select';
import { SelectOption } from '../../../types/props';

interface UserFormProps {
  user?: User;
  setIsBeingEdited?: (boolean: boolean) => void;
}

const UserForm = (props: UserFormProps): JSX.Element => {
  const { user, setIsBeingEdited } = props;
  
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>('');

  const createUser = useMutation({
    mutationFn: (data: UserFormData) => userService.create(data),
    onError: () => {
      setMessage('Error creating user');
    },
    onSuccess: () => {
      setMessage('Successfully created user');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['users']);
      handleClear();
      setIsSubmitting(false);
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

  const formSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Email is invalid"),
    role: z.nativeEnum(Role),
  });

  const { 
    register, reset, handleSubmit, control, formState: { errors, isDirty }
  } = useForm<UserFormData>({
    defaultValues: {
      id: user ? user.id : 0,
      name: user ? user.name : '',
      email: user ? user.email : '',
      role: user ? user.role : Role.USER,
    },
    resolver: zodResolver(formSchema),
  });

  const { field: { value, onChange } } = useController({ name: 'role', control});

  const onSubmit: SubmitHandler<UserFormData> = async data => {
    if (isSubmitting) return;
    try {
      if (!user) {
        setIsSubmitting(true);
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

  const options = Object.values(Role).map(role => {
    const obj: SelectOption = { value: '', label: ''};
    obj.value = role;
    obj.label = role;
    return obj;
  });

  const handleClear = () => reset();

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      {errors.name?.message && <ErrorContainer content={errors.name.message} />}
      <Input name="name" register={register} placeholder="Name" />
      {errors.email?.message && <ErrorContainer content={errors.email.message} />}
      <Input name="email" register={register} placeholder="Email" />
      <Controller name="role" control={control} render={() => (
          <Select 
            className={selectStyles.container}
            isSearchable={false}
            options={options} 
            value={options.find(option => option.value === value)}
            onChange={(option: SingleValue<any>) => onChange(option.value)}
            unstyled
          />
        )}
      />
      <ButtonContainer>
        <Button 
          disabled={!isDirty || isSubmitting} 
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
      {message && <MessageOverlay setMessage={setMessage} content={message} />}
    </form>
  );
}

export default UserForm;