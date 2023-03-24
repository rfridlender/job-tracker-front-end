import { useState } from 'react';
import * as userService from '../../services/userService';
import styles from './UserForm.module.scss';
import { UserFormData } from '../../types/forms';
import { Role } from '../../types/enums';
import { User } from '../../types/models';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { TiCancel, TiPlus } from 'react-icons/ti';

interface UserFormProps {
  setIsUserFormOpen?: (boolean: boolean) => void;
  user?: User;
  setIsBeingEdited?: (boolean: boolean) => void;
  handleScroll: () => void;
}

const UserForm = (props: UserFormProps): JSX.Element => {
  const { setIsUserFormOpen, user, setIsBeingEdited, handleScroll } = props;

  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: () => userService.create(formData),
    onMutate: async (newUser: UserFormData) => {
      await queryClient.cancelQueries(['users']);
      const previousUsers = queryClient.getQueryData<User[]>(['users']);
      previousUsers && queryClient.setQueryData(
        ['users'], 
        [newUser, ...previousUsers]
      );
      return previousUsers;
    },
    onError: (err, newUser, context) => {
      queryClient.setQueryData(['users'], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  const updateUser = useMutation({
    mutationFn: () => userService.update(formData.id, formData),
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

  const [formData, setFormData] = useState<UserFormData>({
    id: user ? user.id : 0,
    name: user ? user.name : '',
    email: user ? user.email : '',
    role: user ? user.role : Role.USER,
  });

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    // handleScroll();
    try {
      if (!user) {
        createUser.mutate(formData);
        setIsUserFormOpen && setIsUserFormOpen(false);
      } else {
        updateUser?.mutate(formData);
        setIsBeingEdited && setIsBeingEdited(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleCancelFunctions = () => {
    handleScroll();
    if (!user) {
      setIsUserFormOpen && setIsUserFormOpen(false);
    } else {
      setIsBeingEdited && setIsBeingEdited(false);
    }
  }

  const { name, email, role} = formData;

  const isFormInvalid = (): boolean => {
    return !(name && email && role);
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <input
        className={styles.inputContainer} type="text" id={styles.nameInputContainer} 
        value={name} name="name" onChange={handleChange}
        autoComplete="off" placeholder="Name"
      />
      <input
        className={styles.inputContainer} type="email" id="email" 
        value={email} name="email" onChange={handleChange}
        autoComplete="off" placeholder="Email"
      />
      <select 
        className={styles.inputContainer} name="role" id={styles.roleInputContainer} 
        onChange={handleChange} value={role}
      >
        {Object.values(Role).map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
      <div className={styles.buttonContainer}>
        <button disabled={isFormInvalid()}>
          <TiPlus />
        </button>
        <div>
          <TiCancel onClick={handleCancelFunctions} />
        </div>
      </div>
    </form>
  );
}

export default UserForm;