import { useState } from 'react';
import styles from './WorkLogForm.module.scss';
import * as workLogService from '../../services/workLogService';
import { WorkLogFormData } from '../../types/forms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '../../types/enums';
import { User } from '../../types/models';
import { hourDifferenceCalculator } from '../../services/helpers';

interface WorkLogFormProps {
  jobId: number;
  user: User;
}

const WorkLogForm = (props: WorkLogFormProps): JSX.Element => {
  const { jobId, user } = props;

  const queryClient = useQueryClient();

  const createWorkLog = useMutation({
    mutationFn: () => workLogService.create(jobId, formData),
    onSettled: () => {
      queryClient.invalidateQueries(['jobs']);
      setFormData({
        id: 0, 
        category: Category.OTHER, 
        workDate: new Date().toISOString().substring(0, 10), 
        startTime: "09:00",
        endTime: "17:00",
        workCompleted: '',
        completed: false,
        incompleteItems: '',
        keyNumber: '',
      });
      setIsSubmitted(false);
    },
  });

  const [formData, setFormData] = useState<WorkLogFormData>({
    id: 0, 
    category: Category.OTHER, 
    workDate: new Date().toISOString().substring(0, 10), 
    startTime: "09:00",
    endTime: "17:00",
    workCompleted: '',
    completed: false,
    incompleteItems: '',
    keyNumber: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    if (evt.target.name !== 'completed') {
      setFormData({ ...formData, [evt.target.name]: evt.target.value });
    } else {
      setFormData({ ...formData, completed: !completed });
    }
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    if(isSubmitted) return;
    try {
      setIsSubmitted(true);
      createWorkLog.mutate();
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

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <input 
        className={styles.inputContainer} type="date" id="workDate"
        value={workDate} name="workDate" onChange={handleChange}
        autoComplete="off" max={new Date().toISOString().substring(0, 10)} 
        disabled={isSubmitted}
      />
      <div className={styles.inputContainer}>{user.name}</div>
      <select 
        className={styles.inputContainer} name="category" id="category" 
        onChange={handleChange} value={category} disabled={isSubmitted}
      >
        {Object.values(Category).map(category => (
          <option key={category} value={category}>{category.replaceAll('_', ' ')}</option>
        ))}
      </select>
      <input 
        className={styles.inputContainer} type="time" id="startTime" 
        value={startTime} name="startTime" onChange={handleChange} 
        autoComplete="off" disabled={isSubmitted}
      />
      <input 
        className={styles.inputContainer} type="time" id="endTime" 
        value={endTime} name="endTime" onChange={handleChange} 
        autoComplete="off" disabled={isSubmitted}
      />
      <div className={styles.inputContainer}>
        {hourDifferenceCalculator(startTime, endTime)}
      </div>
      <input 
        className={styles.inputContainer} type="text" id="workCompleted" 
        value={workCompleted} name="workCompleted" onChange={handleChange} 
        autoComplete="off" placeholder="Work Completed" disabled={isSubmitted}
      />
      <div className={styles.inputContainer} id={styles.completed}>
        <label htmlFor="completed">Completed</label>
        <input 
          type="checkbox" id="completed"
          checked={completed} name="completed" onChange={handleChange} 
          autoComplete="off" disabled={isSubmitted}
        />
      </div>
      {formData.completed ?
        <div />
        :
        <input 
          className={styles.inputContainer} type="text" id="incompleteItems" 
          value={incompleteItems} name="incompleteItems" onChange={handleChange} 
          autoComplete="off" placeholder="Incomplete Items" disabled={isSubmitted}
        />
      }

      {formData.category !== Category.LOCKS_AND_HARDWARE ? 
        <div />
        :
        <input 
          className={styles.inputContainer} type="text" id="keyNumber" 
          value={keyNumber} name="keyNumber" onChange={handleChange} 
          autoComplete="off" placeholder="Key Number" disabled={isSubmitted}
          pattern="[0-9]{5}"
        />
      }
      <button  className={styles.button} disabled={isFormInvalid() || isSubmitted}>
        Plus Icon
      </button>
    </form>
  );
}

export default WorkLogForm;