import { useState } from 'react';
import styles from './WorkLogForm.module.scss';
import * as workLogService from '../../services/workLogService';
import { WorkLogFormData } from '../../types/forms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '../../types/enums';
import { User, WorkLog } from '../../types/models';
import { hourDifferenceCalculator } from '../../services/helpers';
import { TiCancel, TiPlus } from 'react-icons/ti';
import Button from '../Button/Button';

interface WorkLogFormProps {
  jobId: number;
  user: User;
  setIsWorkLogFormOpen?: (boolean: boolean) => void;
  workLog?: WorkLog;
  setIsBeingEdited?: (boolean: boolean) => void;
  handleScroll: () => void;
}

const WorkLogForm = (props: WorkLogFormProps): JSX.Element => {
  const { 
    jobId, user, setIsWorkLogFormOpen, workLog, 
    setIsBeingEdited, handleScroll 
  } = props;

  const queryClient = useQueryClient();

  const createWorkLog = useMutation({
    mutationFn: () => workLogService.create(jobId, formData),
    onSettled: () => queryClient.invalidateQueries(['jobs']),
  });

  const updateWorkLog = useMutation({
    mutationFn: () => workLogService.update(jobId, formData.id, formData),
    onSettled: () => queryClient.invalidateQueries(['jobs']),
  });

  const [formData, setFormData] = useState<WorkLogFormData>({
    id: workLog ? workLog.id : 0, 
    category: workLog ? workLog.category : Category.LOCKS, 
    workDate: workLog ? workLog.workDate : new Date().toISOString().substring(0, 10), 
    startTime: workLog ? workLog.startTime : '09:00',
    endTime: workLog ? workLog.endTime : '17:00',
    workCompleted: workLog ? workLog.workCompleted : '',
    completed: workLog ? workLog.completed : false,
    incompleteItems: workLog ? workLog.incompleteItems : '',
    keyNumber: workLog ? workLog.keyNumber : '',
  });

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (evt.target.name !== 'completed') {
      setFormData({ ...formData, [evt.target.name]: evt.target.value });
    } else {
      setFormData({ ...formData, completed: !completed, incompleteItems: '' });
    }
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    handleScroll();
    try {
      if (!workLog) {
        createWorkLog.mutate();
        setIsWorkLogFormOpen && setIsWorkLogFormOpen(false);
      } else {
        updateWorkLog?.mutate();
        setIsBeingEdited && setIsBeingEdited(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleCancelFunctions = () => {
    handleScroll();
    if (!workLog) {
      setIsWorkLogFormOpen && setIsWorkLogFormOpen(false);
    } else {
      setIsBeingEdited && setIsBeingEdited(false);
    }
  }

  const { 
    category, workDate, startTime, endTime, 
    workCompleted, completed, incompleteItems, keyNumber 
  } = formData;

  const isFormInvalid = (): boolean => {
    return !(category && workDate && startTime && endTime && workCompleted);
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <input 
        className={styles.dateInputContainer} type="date" id="workDate"
        value={workDate} name="workDate" onChange={handleChange}
        autoComplete="off" max={new Date().toISOString().substring(0, 10)} 
      />
      <div className={styles.nameInputContainer}>{user.name}</div>
      <select 
        className={styles.categoryInputContainer} name="category" id="category" 
        onChange={handleChange} value={category}
      >
        {Object.values(Category).map(category => (
          <option key={category} value={category}>{category.replaceAll('_', ' ')}</option>
        ))}
      </select>
      <input 
        className={styles.dateInputContainer} type="time" id="startTime" 
        value={startTime} name="startTime" onChange={handleChange} 
        autoComplete="off"
      />
      <input 
        className={styles.dateInputContainer} type="time" id="endTime" 
        value={endTime} name="endTime" onChange={handleChange} 
        autoComplete="off"
      />
      <div className={styles.hourInputContainer}>
        {hourDifferenceCalculator(startTime, endTime)}
      </div>
      <input 
        className={styles.inputContainer} type="text" id="workCompleted" 
        value={workCompleted} name="workCompleted" onChange={handleChange} 
        autoComplete="off" placeholder="Work Completed"
      />
      <div className={styles.completedInputContainer}>
        <label 
          className={!completed ? styles.incompletedContainer : styles.completedContainer} htmlFor="completed"
        >
          Completed
        </label>
        <input 
          type="checkbox" id="completed"
          checked={completed} name="completed" onChange={handleChange} 
          autoComplete="off"
        />
      </div>
      {completed ?
        <div className={styles.inputContainer} />
        :
        <input 
          className={styles.inputContainer} type="text" id="incompleteItems" 
          value={incompleteItems} name="incompleteItems" onChange={handleChange} 
          autoComplete="off" placeholder="Incomplete Items"
        />
      }
      {category !== Category.LOCKS ? 
        <div className={styles.keyInputContainer} />
        :
        <input 
          className={styles.keyInputContainer} type="text" id="keyNumber" 
          value={keyNumber} name="keyNumber" onChange={handleChange} 
          autoComplete="off" placeholder="Key Number"
          pattern="[0-9]{5}"
        />
      }
      <div className={styles.buttonContainer}>
        <Button icon={<TiPlus />} disabled={isFormInvalid()}/>
        <Button onClick={handleCancelFunctions} icon={<TiCancel />} />
      </div>
    </form>
  );
}

export default WorkLogForm;