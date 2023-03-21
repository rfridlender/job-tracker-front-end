import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { TiPlus } from 'react-icons/ti';
import * as userService from '../../services/userService';
import UserCard from '../UserCard/UserCard';
import UserForm from '../UserForm/UserForm';
import styles from './UserList.module.scss';

const UserList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['users'], userService.index);

  const [isUserFormOpen, setIsUserFormOpen] = useState(false);

  const users = data;

  return (
    <section className={styles.container}>
      <h2>USERS</h2>
      {!isUserFormOpen ?
        <header>
          <div>Name</div>
          <div>Email</div>
          <div />
          <div />
          <div>Role</div>
          <TiPlus onClick={() => setIsUserFormOpen(true)} />
        </header>
        :
        <UserForm setIsUserFormOpen={setIsUserFormOpen} />
      }
      {users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </section>
  );
}
 
export default UserList;