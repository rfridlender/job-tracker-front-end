import { useState } from 'react';
import * as userService from '../../services/userService';
import styles from './UserForm.module.scss';
import { UserFormData } from '../../types/forms';
import { Role } from '../../types/enums';
import { User } from '../../types/models';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { TiCancel, TiPlus } from 'react-icons/ti';
import { TbEraser } from 'react-icons/tb';
import BigButton from '../BigButton/BigButton';

interface UserFormProps {
  user?: User;
  setIsBeingEdited?: (boolean: boolean) => void;
}

const UserForm = (props: UserFormProps): JSX.Element => {
  const { user, setIsBeingEdited } = props;
  
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: () => userService.create(formData),
    onSettled: () => {
      queryClient.invalidateQueries(['users']);
      handleClear();
      setIsBeingSubmitted(false);
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
  const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    // if (isBeingSubmitted) return;
    try {
      if (!user) {
        setIsBeingSubmitted(true);
        createUser.mutate();
      } else {
        setIsBeingEdited && setIsBeingEdited(false);
        updateUser?.mutate(formData);
      }
    } catch (err) {
      setIsBeingSubmitted(false);
      console.log(err);
    }
  }

  const handleClear = () => setFormData({ id: 0, name: '', email: '', role: Role.USER });

  const { name, email, role} = formData;

  const isFormInvalid = (): boolean => {
    return !(name && email && role);
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <input 
        type="text" value={name} name="name" 
        onChange={handleChange} autoComplete="off" placeholder="Name"
      />
      <input 
        type="email" value={email} name="email" 
        onChange={handleChange} autoComplete="off" placeholder="Email"
      />
      <select name="role" onChange={handleChange} value={role}>
        {Object.values(Role).map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
      <div className={styles.buttonContainer}>
        <BigButton 
          disabled={isFormInvalid() || isBeingSubmitted} 
          icon={!isBeingSubmitted && <TiPlus />}
          content={!isBeingSubmitted ? 'Save' : 'Saving...'}
          accent 
        />
        {!user || !setIsBeingEdited ?
          <BigButton onClick={handleClear} icon={<TbEraser />} content="Clear" />
          :
          <BigButton onClick={() => setIsBeingEdited(false)} icon={<TiCancel />} content="Cancel" />
        }
      </div>
    </form>
  );
}

export default UserForm;