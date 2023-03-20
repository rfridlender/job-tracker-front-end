import { useQuery, useQueryClient } from '@tanstack/react-query';
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

  return (
    <div className={styles.container}>
      <div>
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
        <div />
      </div>
      <WorkLogForm jobId={job.id} user={user} />
      {job.workLogs?.map(workLog => (
        <WorkLogCard key={workLog.id} jobId={job.id} workLog={workLog} />
      ))}
    </div>
  );
}
 
export default WorkLogList;