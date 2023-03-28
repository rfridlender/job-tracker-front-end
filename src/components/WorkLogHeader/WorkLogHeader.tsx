import { TiPlus } from 'react-icons/ti';
import { User } from '../../types/models';
import styles from './WorkLogHeader.module.scss';

interface WorkLogHeaderProps {
  handleOpenWorkLogForm: () => void;
}

const WorkLogHeader = (props: WorkLogHeaderProps) => {
  const { handleOpenWorkLogForm } = props;

  return (
    <header className={styles.container}>
      <div className={styles.dateContainer}>Work Date</div>
      <div className={styles.nameContainer}>Name</div>
      <div className={styles.categoryContainer}>Category</div>
      <div className={styles.dateContainer}>Start Time</div>
      <div className={styles.dateContainer}>End Time</div>
      <div className={styles.hourContainer}>Hours</div>
      <div>Work Completed</div>
      <div className={styles.completedContainer}>Completed</div>
      <div>Incomplete Items</div>
      <div className={styles.keyContainer}>Key Number</div>
      <div className={styles.buttonContainer}>
        <TiPlus onClick={handleOpenWorkLogForm} />
      </div>
  </header>
  );
}
 
export default WorkLogHeader;