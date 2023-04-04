import { TiPlus } from 'react-icons/ti';
import { Role } from '../../types/enums';
import { User } from '../../types/models';
import styles from './JobHeader.module.scss';
import Button from '../Button/Button';
import ButtonContainer from '../ButtonContainer/ButtonContainer';

interface JobHeaderProps {
  user: User;
  handleOpenJobForm: () => void;
}

const JobHeader = (props: JobHeaderProps) => {
  const { user, handleOpenJobForm }= props;

  return (
    <header className={styles.container}>
      <div>Status</div>
      <div>Address</div>
      <div id={styles.takeoffContainer}>Takeoff</div>
      <div>Lock Status</div>
      <div>Shelving Status</div>
      <div>Shower Status</div>
      <div>Mirror Status</div>
      <div>Builder</div>
      <div id={styles.accessContainer}>Job Site Access</div>
      <ButtonContainer small>
        {user.role === Role.ADMIN && <Button onClick={handleOpenJobForm} icon={<TiPlus />} />}
      </ButtonContainer>
    </header>
  );
}
 
export default JobHeader;