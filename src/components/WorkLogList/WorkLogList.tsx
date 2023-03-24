import { useState } from 'react';
import { TiPlus } from 'react-icons/ti';
import { Job, User } from '../../types/models';
import WorkLogCard from '../WorkLogCard/WorkLogCard';
import WorkLogForm from '../WorkLogForm/WorkLogForm';
import styles from './WorkLogList.module.scss';

interface WorkLogListProps {
  job: Job;
  user: User;
}

const WorkLogList = (props: WorkLogListProps) => {
  const { job, user } = props;

  const [isWorkLogFormOpen, setIsWorkLogFormOpen] = useState(false);

  return (
    <div className={styles.container}>
      {!isWorkLogFormOpen ? 
        <header>
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
            <TiPlus onClick={() => setIsWorkLogFormOpen(true)} />
          </div>
        </header>
        :
        <WorkLogForm jobId={job.id} user={user} setIsWorkLogFormOpen={setIsWorkLogFormOpen} />
      }
      {!!job.workLogs.length && <div className={styles.divider} />}
      {job.workLogs?.map(workLog => (
        <WorkLogCard key={workLog.id} jobId={job.id} workLog={workLog} user={user} />
      ))}
    </div>
  );
}
 
export default WorkLogList;