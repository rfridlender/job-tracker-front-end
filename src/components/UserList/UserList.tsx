import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { TiPlus } from 'react-icons/ti';
import * as userService from '../../services/userService';
import UserCard from '../UserCard/UserCard';
import UserForm from '../UserForm/UserForm';
import styles from './UserList.module.scss';

const UserList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['users'], userService.index);

  const [isUserFormOpen, setIsUserFormOpen] = useState(false);

  const scrollContainer = useRef<HTMLDivElement>(null);


  const handleScroll = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  const handleOpenUserForm = () => {
    setIsUserFormOpen(true);
    handleScroll();
  }

  const users = data;

  return (
    <section className={styles.container}>
      <h2>Users</h2>
      <div 
        className={styles.scrollContainer} 
        ref={scrollContainer} 
      >
        {!isUserFormOpen ?
          <header>
            <div className={styles.nameContainer}>Name</div>
            <div>Email</div>
            <div className={styles.roleContainer}>Role</div>
            <div className={styles.buttonContainer}>
              <TiPlus onClick={handleOpenUserForm} />
            </div>
          </header>
          :
          <UserForm setIsUserFormOpen={setIsUserFormOpen} handleScroll={handleScroll} />
        }
        {users?.map(user => (
          <UserCard key={user.id} user={user} handleScroll={handleScroll} />
        ))}
      </div>
    </section>
  );
}
 
export default UserList;