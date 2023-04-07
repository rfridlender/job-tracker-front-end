import { TiPlus } from 'react-icons/ti';
import { MouseEvent } from 'react';
import { Role } from '../../../types/enums';
import { User } from '../../../types/models';
import styles from './JobHeader.module.scss';
import Button from '../../UI/Button/Button';
import ButtonContainer from '../../UI/ButtonContainer/ButtonContainer';

interface JobHeaderProps {
  user: User;
  handleOpenJobForm: () => void;
}

const JobHeader = (props: JobHeaderProps) => {
  const { user, handleOpenJobForm }= props;

  const handleDoubleClick = (evt: MouseEvent<HTMLElement>) => {
    evt.detail === 2 && handleOpenJobForm();
  }

  return (
    <header className={styles.container} onClick={handleDoubleClick}>
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