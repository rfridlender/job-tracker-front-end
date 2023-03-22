import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { User, WorkLog } from '../../types/models';
import styles from './WorkLogCard.module.scss';
import * as workLogService from '../../services/workLogService';
import WorkLogForm from '../WorkLogForm/WorkLogForm';
import { TiEdit, TiMinus } from 'react-icons/ti';
import { twentyFourToTwelveConvertor } from '../../services/helpers';

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
          <div>{twentyFourToTwelveConvertor(workLog.startTime)}</div>
          <div>{twentyFourToTwelveConvertor(workLog.endTime)}</div>
          <div>{`${workLog.hourDifference.toFixed(2)}h`}</div>
          <div>{workLog.workCompleted}</div>
          <div>{workLog.completed ? 'Yes' : 'No'}</div>
          <div>{workLog.incompleteItems}</div>
          <div>{workLog.keyNumber}</div>
          {user.name !== workLog.employeeName ?
            <div />  
            :
            <div>
              <TiEdit onClick={() => setIsBeingEdited(true)} />
              <TiMinus onClick={() => setIsBeingDeleted(true)} />
            </div>
          }
          {isBeingDeleted &&
            <div id={styles.deleteOptions}>
              <section>
                <div>Are you sure you want to delete this work log from {workLog.workDate}?</div>
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