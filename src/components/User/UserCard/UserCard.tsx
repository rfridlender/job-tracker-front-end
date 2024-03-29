import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { User } from '../../../types/models';
import styles from './UserCard.module.scss';
import * as userService from '../../../services/userService';
import { TiEdit, TiMinus } from 'react-icons/ti';
import UserForm from '../UserForm/UserForm';
import DeleteOverlay from '../../UI/DeleteOverlay/DeleteOverlay';
import Button from '../../UI/Button/Button';
import ButtonContainer from '../../UI/ButtonContainer/ButtonContainer';

interface UserCardProps {
  user: User;
}

const UserCard = (props: UserCardProps) => {
  const { user } = props;
  
  const queryClient = useQueryClient();

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingDeleted, setIsBeingDeleted] = useState(false);

  const deleteUser = useMutation({
    mutationFn: () => userService.delete(user.id),
    onMutate: async () => {
      await queryClient.cancelQueries(['users']);
      const previousUsers = queryClient.getQueryData<User[]>(['users']);
      previousUsers && queryClient.setQueryData(
        ['users'], 
        previousUsers.filter(previousUser => previousUser.id !== user.id ? true : false)
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

  const handleDelete = () => {
    try {
      deleteUser.mutate();
      setIsBeingDeleted(false);
    } catch (err) {
      console.log(err);
    }
  }

  if (isBeingEdited) {
    return (
      <UserForm user={user} setIsBeingEdited={setIsBeingEdited} />
    );
  } else {
    return (
      <article className={styles.container}>
        <div>{user.name}</div>
        <a href={`mailto:${user.email}`}>{user.email}</a>
        <div>{user.role}</div>
        <ButtonContainer>
          <Button onClick={() => setIsBeingEdited(true)} icon={<TiEdit />} content="Edit" accent />
          <Button onClick={() => setIsBeingDeleted(true)} icon={<TiMinus />} content="Delete" />
        </ButtonContainer>
        {isBeingDeleted && 
          <DeleteOverlay 
            setIsBeingDeleted={setIsBeingDeleted} handleDelete={handleDelete} user={user} 
          />
        }
      </article>
    );
  }
}
 
export default UserCard;