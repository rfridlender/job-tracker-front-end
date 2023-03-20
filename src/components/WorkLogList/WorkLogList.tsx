import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { TiPlus } from 'react-icons/ti';
import * as workLogService from '../../services/workLogService';
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
          <div>Work Date</div>
          <div>Name</div>
          <div>Category</div>
          <div>Start Time</div>
          <div>End Time</div>
          <div>Hours</div>
          <div>Work Completed</div>
          <div>Completed</div>
          <div>Incomplete Items</div>
          <div>Key Number</div>
          <TiPlus onClick={() => setIsWorkLogFormOpen(true)} />
        </header>
        :
        <WorkLogForm jobId={job.id} user={user} setIsWorkLogFormOpen={setIsWorkLogFormOpen} />
      }
      {job.workLogs?.map(workLog => (
        <WorkLogCard key={workLog.id} jobId={job.id} workLog={workLog} user={user} />
      ))}
    </div>
  );
}
 
export default WorkLogList;