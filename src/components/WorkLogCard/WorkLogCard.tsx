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
  setIsWorkLogFormOpen: (boolean: boolean) => void;
  handleScroll: () => void;
}

const WorkLogCard = (props: WorkLogCardProps) => {
  const { jobId, workLog, user, setIsWorkLogFormOpen, handleScroll } = props;

  const queryClient = useQueryClient();
  
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingDeleted, setIsBeingDeleted] = useState(false);

  const deleteWorkLog = useMutation({
    mutationFn: () => workLogService.delete(jobId, workLog.id),
    onSettled: () => queryClient.invalidateQueries(['jobs']),
  });

  const handleDelete = () => {
    handleScroll();
    try {
      deleteWorkLog.mutate();
      setIsBeingDeleted(false);
    } catch (err) {
      console.log(err);
    }
  }

  const handleEditWorkLog = () => {
    setIsBeingEdited(true);
    handleScroll();
  }

  if (isBeingEdited) {
    return (
      <WorkLogForm 
        jobId={jobId} user={user} workLog={workLog} setIsBeingEdited={setIsBeingEdited} handleScroll={handleScroll}
      />
    );
  } else {
    return (
      <div className={styles.container}>
          <div className={styles.dateContainer}>{workLog.workDate}</div>
          <div className={styles.nameContainer}>{workLog.employeeName}</div>
          <div className={styles.categoryContainer}>{workLog.category}</div>
          <div className={styles.dateContainer}>
            {twentyFourToTwelveConvertor(workLog.startTime)}
          </div>
          <div className={styles.dateContainer}>
            {twentyFourToTwelveConvertor(workLog.endTime)}
          </div>
          <div className={styles.hourContainer}>
            {`${workLog.hourDifference.toFixed(2)}h`}
          </div>
          <div>{workLog.workCompleted}</div>
          <div className={styles.completedContainer}>{workLog.completed ? 'Yes' : 'No'}</div>
          <div>{workLog.incompleteItems}</div>
          <div className={styles.keyContainer}>{workLog.keyNumber}</div>
          {user.name !== workLog.employeeName ?
            <div className={styles.buttonContainer} />  
            :
            <div className={styles.buttonContainer}>
              <TiEdit onClick={handleEditWorkLog} />
              <TiMinus onClick={() => setIsBeingDeleted(true)} />
            </div>
          }
          {isBeingDeleted &&
            <div className={styles.deleteOptions}>
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