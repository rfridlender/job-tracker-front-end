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
}

const UserForm = (props: UserFormProps): JSX.Element => {
  const { setIsUserFormOpen, user, setIsBeingEdited } = props;

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
    password: '',
    passwordConf: '',
    role: user ? user.role : Role.USER,
  });

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
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
    if (!user) {
      setIsUserFormOpen && setIsUserFormOpen(false);
    } else {
      setIsBeingEdited && setIsBeingEdited(false);
    }
  }

  const { name, email, password, passwordConf, role} = formData;

  const isFormInvalid = (): boolean => {
    if (!user) {
      return !(name && email && password && password === passwordConf && role);
    } else {
      return !(name && email && role);
    }
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <input
        className={styles.inputContainer} type="text" id="name" 
        value={name} name="name" onChange={handleChange}
        autoComplete="off" placeholder="Name"
      />
      <input
        className={styles.inputContainer} type="email" id="email" 
        value={email} name="email" onChange={handleChange}
        autoComplete="off" placeholder="Email"
      />
      {!user ?
        <>
          <input
            className={styles.inputContainer} type="password" id="password" 
            value={password} name="password" onChange={handleChange}
            autoComplete="off" placeholder="Password"
          />
          <input
            className={styles.inputContainer} type="password" id="passwordConf" 
            value={passwordConf} name="passwordConf" onChange={handleChange}
            autoComplete="off" placeholder="Confirm Password"
          />
        </>
        :
        <>
          <div />
          <div />
        </>
      }
      <select 
        className={styles.inputContainer} name="role" id="role" 
        onChange={handleChange} value={role}
      >
        {Object.values(Role).map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
      <div>
        <button disabled={isFormInvalid()} className={styles.button}>
          <TiPlus />
        </button>
        <TiCancel onClick={handleCancelFunctions} />
      </div>
    </form>
  );
}

export default UserForm;