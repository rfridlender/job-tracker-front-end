import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { User, WorkLog } from '../../types/models';
import styles from './WorkLogCard.module.scss';
import * as workLogService from '../../services/workLogService';
import WorkLogForm from '../WorkLogForm/WorkLogForm';
import { TiEdit, TiMinus } from 'react-icons/ti';

interface WorkLogCardProps {
  jobId: number;
  workLog: WorkLog;
  user: User;
}

const WorkLogCard = (props: WorkLogCardProps) => {
  const { jobId, workLog, user } = props;

  const queryClient = useQueryClient();
  
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingDeleted, setIsBeingDeleted] = useState(false);

  const deleteWorkLog = useMutation({
    mutationFn: () => workLogService.delete(jobId, workLog.id),
    onSettled: () => queryClient.invalidateQueries(['jobs']),
  });

  const handleDelete = () => {
    try {
      deleteWorkLog.mutate();
      setIsBeingDeleted(false);
    } catch (err) {
      console.log(err);
    }
  }

  if (isBeingEdited) {
    return (
      <WorkLogForm 
        jobId={jobId} user={user} workLog={workLog} setIsBeingEdited={setIsBeingEdited} 
      />
    );
  } else {
    return (
      <div className={styles.container}>
          <div>{workLog.workDate}</div>
          <div>{workLog.employeeName}</div>
          <div>{workLog.category}</div>
          <div>{workLog.startTime}</div>
          <div>{workLog.endTime}</div>
          <div>{`${workLog.hourDifference}h`}</div>
          <div>{workLog.workCompleted}</div>
          <div>{workLog.completed ? 'Yes' : 'No'}</div>
          <div>{workLog.incompleteItems}</div>
          <div>{workLog.keyNumber}</div>
          <div>
            <TiEdit onClick={() => setIsBeingEdited(true)} />
            <TiMinus onClick={() => setIsBeingDeleted(true)} />
          </div>
          {isBeingDeleted &&
            <div id={styles.deleteOptions}>
              <section>
                <div>Are you sure you want to delete this work log?</div>
                <div>
                  <button onClick={handleDelete}>Delete</button>
                  <button onClick={() => setIsBeingDeleted(false)}>Cancel</button>
                </div>
              </section>
            </div>
          }
      </div>
    );
  }
}
 
export default WorkLogCard;