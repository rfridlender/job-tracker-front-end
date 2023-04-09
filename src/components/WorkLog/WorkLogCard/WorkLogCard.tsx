import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { User, WorkLog } from '../../../types/models';
import styles from './WorkLogCard.module.scss';
import * as workLogService from '../../../services/workLogService';
import WorkLogForm from '../WorkLogForm/WorkLogForm';
import { TiEdit, TiMinus } from 'react-icons/ti';
import { twentyFourToTwelveConvertor } from '../../../services/helpers';
import DeleteOverlay from '../../UI/DeleteOverlay/DeleteOverlay';
import Button from '../../UI/Button/Button';
import ButtonContainer from '../../UI/ButtonContainer/ButtonContainer';
import TableCell from '../../UI/TableCell/TableCell';

interface WorkLogCardProps {
  jobId: number;
  workLog: WorkLog;
  user: User;
  handleScroll: () => void;
}

const WorkLogCard = (props: WorkLogCardProps) => {
  const { jobId, workLog, user, handleScroll } = props;

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
        jobId={jobId} user={user} workLog={workLog} 
        setIsBeingEdited={setIsBeingEdited} handleScroll={handleScroll}
      />
    );
  } else {
    return (
      <div className={styles.container}>
        <TableCell content={workLog.workDate} width={9} />
        <TableCell content={workLog.employeeName} width={12} />
        <TableCell content={workLog.category} width={8.5} />
        <TableCell content={twentyFourToTwelveConvertor(workLog.startTime)} width={8.5} />
        <TableCell content={twentyFourToTwelveConvertor(workLog.endTime)} width={8.5} />
        <TableCell content={`${workLog.hourDifference.toFixed(2)}h`} width={5} />
        <TableCell content={workLog.workCompleted} />
        <TableCell content={workLog.completed ? 'Yes' : 'No'} width={8} />
        <TableCell content={workLog.incompleteItems} width={28.5} />
        <TableCell content={workLog.keyNumber} width={8} />
        <ButtonContainer small>
          {user.name === workLog.employeeName && 
            <>
              <Button onClick={handleEditWorkLog} icon={<TiEdit />}/>
              <Button onClick={() => setIsBeingDeleted(true)} icon={<TiMinus />}/>
            </>
          }
        </ButtonContainer>
        {isBeingDeleted &&
          <DeleteOverlay 
            setIsBeingDeleted={setIsBeingDeleted} workLog={workLog} handleDelete={handleDelete} 
          />
        }
      </div>
    );
  }
}
 
export default WorkLogCard;