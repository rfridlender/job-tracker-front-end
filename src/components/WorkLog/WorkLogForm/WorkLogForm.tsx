import { useState } from 'react';
import styles from './WorkLogForm.module.scss';
import selectStyles from '../../UI/Select/Select.module.scss';
import * as workLogService from '../../../services/workLogService';
import { WorkLogFormData } from '../../../types/forms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '../../../types/enums';
import { User, WorkLog } from '../../../types/models';
import { hourDifferenceCalculator } from '../../../services/helpers';
import { TiCancel, TiPlus } from 'react-icons/ti';
import Button from '../../UI/Button/Button';
import ButtonContainer from '../../UI/ButtonContainer/ButtonContainer';
import { z } from 'zod';
import { Controller, SubmitHandler, useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../UI/Input/Input';
import TableCell from '../../UI/TableCell/TableCell';
import { SelectOption } from '../../../types/props';
import Select, { SingleValue } from 'react-select';

interface WorkLogFormProps {
  jobId: number;
  user: User;
  setIsWorkLogFormOpen?: (boolean: boolean) => void;
  workLog?: WorkLog;
  setIsBeingEdited?: (boolean: boolean) => void;
  handleScroll: () => void;
}

const WorkLogForm = (props: WorkLogFormProps): JSX.Element => {
  const { jobId, user, setIsWorkLogFormOpen, workLog, setIsBeingEdited, handleScroll } = props;

  const queryClient = useQueryClient();

  const createWorkLog = useMutation({
    mutationFn: (data: WorkLogFormData) => workLogService.create(jobId, data),
    onSettled: () => queryClient.invalidateQueries(['jobs']),
  });

  const updateWorkLog = useMutation({
    mutationFn: (data: WorkLogFormData) => workLogService.update(jobId, data.id, data),
    onSettled: () => queryClient.invalidateQueries(['jobs']),
  });

  const formSchema = z.object({
    id: z.number(),
    category: z.nativeEnum(Category),
    workDate: z.string().min(10).max(10),
    startTime: z.string().min(5).max(5),
    endTime: z.string().min(5).max(5),
    workCompleted: z.string().min(1),
    completed: z.boolean(),
    incompleteItems: z.string(),
    keyNumber: z.string(),
  });

  const { 
    register, getValues, handleSubmit, control, formState: { isValid } 
  } = useForm<WorkLogFormData>({
    defaultValues: {
      id: workLog ? workLog.id : 0, 
      category: workLog ? workLog.category : Category.LOCKS, 
      workDate: workLog ? workLog.workDate : new Date().toISOString().substring(0, 10), 
      startTime: workLog ? workLog.startTime.substring(0, 5) : '09:00',
      endTime: workLog ? workLog.endTime.substring(0, 5) : '17:00',
      workCompleted: workLog ? workLog.workCompleted : '',
      completed: workLog ? workLog.completed : false,
      incompleteItems: workLog ? workLog.incompleteItems : '',
      keyNumber: workLog ? workLog.keyNumber : '',
    },
    resolver: zodResolver(formSchema),
  });

  const { field: { value: categoryValue, onChange: onCategoryChange } } = useController({ 
    name: 'category', control 
  });

  const { field } = useController({ name: 'completed', control });

  const onSubmit: SubmitHandler<WorkLogFormData> = async data => {
    console.log(data);
    handleScroll();
    try {
      if (!workLog) {
        createWorkLog.mutate(data);
        setIsWorkLogFormOpen && setIsWorkLogFormOpen(false);
      } else {
        updateWorkLog?.mutate(data);
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

  const categoryOptions = Object.values(Category).map(role => {
    const obj: SelectOption = { value: '', label: ''};
    obj.value = role;
    obj.label = role;
    return obj;
  });

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <Input type="date" name="workDate" register={register} width={8.5} />
      <TableCell content={user.name} width={12} />
      <Controller name="category" control={control} render={() => (
          <Select 
            className={selectStyles.mediumContainer}
            isSearchable={false}
            options={categoryOptions} 
            value={categoryOptions.find(option => option.value === categoryValue)}
            onChange={(option: SingleValue<any>) => onCategoryChange(option.value)}
          />
        )}
      />
      <Input type="time" name="startTime" register={register} width={8} />
      <Input type="time" name="endTime" register={register} width={8} />
      <TableCell 
        content={hourDifferenceCalculator(getValues('startTime'), getValues('endTime'))} width={5}
      />
      <Input name="workCompleted" register={register} placeholder="Work Completed" />
      <TableCell status="completed" width={8} smallPadding>
        <label htmlFor={`completed${workLog?.id}`}>
          {!getValues('completed') ? 'Incomplete' : 'Complete'}
        </label>
        <input type="checkbox" id={`completed${workLog?.id}`} {...register('completed')} />
      </TableCell>
      {getValues('completed') ?
        <TableCell width={28.5} />
        :
        <Input 
          name="incompleteItems" register={register} placeholder="Incomplete Items" width={28} 
        />
      }
      {getValues('category') !== Category.LOCKS ? 
        <TableCell width={8} />
        :
        <Input name="keyNumber" register={register} placeholder="Key Number" width={7.5} />
      }
      <ButtonContainer small>
        <Button disabled={!isValid} icon={<TiPlus />} />
        <Button onClick={handleCancelFunctions} icon={<TiCancel />} />
      </ButtonContainer>
    </form>
  );
}

export default WorkLogForm;