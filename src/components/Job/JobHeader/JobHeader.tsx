import { TiPlus } from 'react-icons/ti';
import { MouseEvent } from 'react';
import { Role } from '../../../types/enums';
import { User } from '../../../types/models';
import styles from './JobHeader.module.scss';
import Button from '../../UI/Button/Button';
import ButtonContainer from '../../UI/ButtonContainer/ButtonContainer';
import TableCell from '../../UI/TableCell/TableCell';

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
      <TableCell content="Status" width={8.5}/>
      <TableCell content="Address" width={16.5} />
      <TableCell content="Takeoff" width={5} />
      <TableCell content="Lock Status" width={16.5} />
      <TableCell content="Shelving Status" width={16.5} />
      <TableCell content="Shower Status" width={16.5} />
      <TableCell content="Mirror Status" width={16.5} />
      <TableCell content="Builder" width={16.5} />
      <TableCell content="Job Site Access" width={12.5} />
      <ButtonContainer small>
        {user.role === Role.ADMIN && <Button onClick={handleOpenJobForm} icon={<TiPlus />} />}
      </ButtonContainer>
    </header>
  );
}
 
export default JobHeader;