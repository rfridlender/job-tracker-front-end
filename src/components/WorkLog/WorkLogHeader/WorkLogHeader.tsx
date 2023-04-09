import { TiPlus } from 'react-icons/ti';
import styles from './WorkLogHeader.module.scss';
import Button from '../../UI/Button/Button';
import ButtonContainer from '../../UI/ButtonContainer/ButtonContainer';
import TableCell from '../../UI/TableCell/TableCell';

interface WorkLogHeaderProps {
  handleOpenWorkLogForm: () => void;
}

const WorkLogHeader = (props: WorkLogHeaderProps) => {
  const { handleOpenWorkLogForm } = props;

  return (
    <header className={styles.container}>
      <TableCell content="Work Date" width={9} />
      <TableCell content="Name" width={12} />
      <TableCell content="Category" width={8.5} />
      <TableCell content="Start Time" width={8.5} />
      <TableCell content="End Time" width={8.5} />
      <TableCell content="Hours" width={5} />
      <TableCell content="Work Completed" />
      <TableCell content="Completed" width={8} />
      <TableCell content="Incomplete Items" width={28.5} />
      <TableCell content="Key Number" width={8} />
      <ButtonContainer small>
        <Button onClick={handleOpenWorkLogForm} icon={<TiPlus />} />
      </ButtonContainer>
  </header>
  );
}
 
export default WorkLogHeader;