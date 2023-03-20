import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { User, WorkLog } from '../../types/models';
import { WorkLogFormData } from '../../types/forms';
import styles from './WorkLogCard.module.scss';
import * as workLogService from '../../services/workLogService';
import { Category } from '../../types/enums';
import { hourDifferenceCalculator } from '../../services/helpers';

interface WorkLogCardProps {
  jobId: number;
  workLog: WorkLog;
}

const WorkLogCard = (props: WorkLogCardProps) => {
  const { jobId, workLog } = props;

  const queryClient = useQueryClient();

  const updateWorkLog = useMutation({
    mutationFn: () => workLogService.update(jobId, workLog.id, formData),
    onSettled: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });
  
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [formData, setFormData] = useState<WorkLogFormData>({
    id: workLog.id, 
    category: workLog.category, 
    workDate: workLog.workDate, 
    startTime: workLog.startTime,
    endTime: workLog.endTime,
    workCompleted: workLog.workCompleted,
    completed: workLog.completed,
    incompleteItems: workLog.incompleteItems,
    keyNumber: workLog.keyNumber,
  });

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    if (evt.target.name !== 'completed') {
      setFormData({ ...formData, [evt.target.name]: evt.target.value });
    } else {
      setFormData({ ...formData, completed: !completed });
    }
  }
  
  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    try {
      updateWorkLog.mutate();
      setIsBeingEdited(false);
    } catch (err) {
      console.log(err);
    }
  }

  const { 
    category, workDate, startTime, endTime, 
    workCompleted, completed, incompleteItems, keyNumber 
  } = formData;

  const isFormInvalid = (): boolean => {
    return !(category && workDate && startTime && endTime && workCompleted);
  }

  if (isBeingEdited) {
    return (
      <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
        <input 
          className={styles.inputContainer} type="date" id="workDate"
          value={workDate} name="workDate" onChange={handleChange}
          autoComplete="off" max={new Date().toISOString().substring(0, 10)} 
        />
        <div className={styles.inputContainer}>{workLog.employeeName}</div>
        <select 
          className={styles.inputContainer} name="category" id="category" 
          onChange={handleChange} value={category}
        >
          {Object.values(Category).map(category => (
            <option key={category} value={category}>{category.replaceAll('_', ' ')}</option>
          ))}
        </select>
        <input 
          className={styles.inputContainer} type="time" id="startTime" 
          value={startTime} name="startTime" onChange={handleChange} 
          autoComplete="off"
        />
        <input 
          className={styles.inputContainer} type="time" id="endTime" 
          value={endTime} name="endTime" onChange={handleChange} 
          autoComplete="off"
        />
        <div className={styles.inputContainer}>
          {hourDifferenceCalculator(startTime, endTime)}
        </div>
        <input 
          className={styles.inputContainer} type="text" id="workCompleted" 
          value={workCompleted} name="workCompleted" onChange={handleChange} 
          autoComplete="off" placeholder="Work Completed"
        />
        <div className={styles.inputContainer} id={styles.completed}>
          <label htmlFor="completed">Completed</label>
          <input 
            type="checkbox" id="completed"
            checked={completed} name="completed" onChange={handleChange} 
            autoComplete="off"
          />
        </div>
        <input 
          className={styles.inputContainer} type="text" id="incompleteItems" 
          value={incompleteItems} name="incompleteItems" onChange={handleChange} 
          autoComplete="off" placeholder="Incomplete Items"
        />
        {formData.category !== Category.LOCKS_AND_HARDWARE ? 
          <div />
          :
          <input 
            className={styles.inputContainer} type="text" id="keyNumber" 
            value={keyNumber} name="keyNumber" onChange={handleChange} 
            autoComplete="off" placeholder="Key Number"
            pattern="[0-9]{5}"
          />
        }
        <div>
          <button disabled={isFormInvalid()} className={styles.button}>Save</button>
          <div onClick={() => setIsBeingEdited(false)}>Cancel</div>
        </div>
      </form>
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
          <div onClick={() => setIsBeingEdited(true)}>Edit</div>
      </div>
    );
  }
}
 
export default WorkLogCard;