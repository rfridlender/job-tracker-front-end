import { useState } from 'react';
import { Job, User } from '../../../types/models';
import WorkLogCard from '../WorkLogCard/WorkLogCard';
import WorkLogForm from '../WorkLogForm/WorkLogForm';
import WorkLogHeader from '../WorkLogHeader/WorkLogHeader';
import styles from './WorkLogList.module.scss';

interface WorkLogListProps {
  job: Job;
  user: User;
  handleScroll: () => void;
}

const WorkLogList = (props: WorkLogListProps) => {
  const { job, user, handleScroll } = props;

  const [isWorkLogFormOpen, setIsWorkLogFormOpen] = useState(false);

  const handleOpenWorkLogForm = () => {
    setIsWorkLogFormOpen(true);
    handleScroll();
  }

  return (
    <div className={styles.container}>
      {!isWorkLogFormOpen ? 
        <WorkLogHeader handleOpenWorkLogForm={handleOpenWorkLogForm} />
        :
        <WorkLogForm 
          jobId={job.id} user={user} 
          setIsWorkLogFormOpen={setIsWorkLogFormOpen} handleScroll={handleScroll}
        />
      }
      {!!job.workLogs.length && <div className={styles.divider} />}
      {job.workLogs?.map(workLog => (
        <WorkLogCard 
          key={workLog.id} jobId={job.id} workLog={workLog} user={user} handleScroll={handleScroll}
        />
      ))}
    </div>
  );
}
 
export default WorkLogList;