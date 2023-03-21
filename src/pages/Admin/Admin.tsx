import ContractorList from '../../components/ContractorList/ContractorList';
import UserList from '../../components/UserList/UserList';
import { User } from '../../types/models';
import styles from './Admin.module.scss';

interface AdminProps {
  user: User;
}

const Admin = (props: AdminProps): JSX.Element => {
  const { } = props;
  
  return (
    <main className={styles.container}>
      <h1>ADMIN</h1>
      <ContractorList />
      <UserList />
    </main>
  );
}

export default Admin;
