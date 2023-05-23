import { useState } from 'react';
import styles from './JobForm.module.scss';
import selectStyles from '../../UI/Select/Select.module.scss';
import * as jobService from '../../../services/jobService';
import { JobFormData, PhotoFormData } from '../../../types/forms';
import { Role, Status } from '../../../types/enums';
import { Contractor, Job, User } from '../../../types/models';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TiPlus, TiCancel } from 'react-icons/ti';
import { HiDocumentPlus, HiDocumentCheck, HiDocumentText } from 'react-icons/hi2';
import Button from '../../UI/Button/Button';
import ButtonContainer from '../../UI/ButtonContainer/ButtonContainer';
import { z } from 'zod';
import { Controller, SubmitHandler, useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../UI/Input/Input';
import { SelectOption } from '../../../types/props';
import Select, { SingleValue } from 'react-select';
import TableCell from '../../UI/TableCell/TableCell';

interface JobFormProps {
  contractors: Contractor[] | undefined;
  setIsJobFormOpen?: (boolean: boolean) => void;
  job?: Job;
  setIsBeingEdited?: (boolean: boolean) => void;
  user: User;
  handleScroll: () => void;
}

const JobForm = (props: JobFormProps): JSX.Element => {
  const { 
    contractors, setIsJobFormOpen, job, 
    setIsBeingEdited, user, handleScroll 
  } = props;

  const queryClient = useQueryClient();

  const createJob = useMutation({
    mutationFn: (data: JobFormData) => jobService.create(data, photoData),
    onMutate: async (newJob: JobFormData) => {
      await queryClient.cancelQueries(['jobs']);
      const previousJobs = queryClient.getQueryData<Job[]>(['jobs']);
      previousJobs && queryClient.setQueryData(['jobs'], [newJob, ...previousJobs]);
      return previousJobs;
    },
    onError: (err, newJob, context) => {
      queryClient.setQueryData(['jobs'], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });

  const updateJob = useMutation({
    mutationFn: (data: JobFormData) => jobService.update(data.id, data, photoData),
    onMutate: async (updatedJob: JobFormData) => {
      await queryClient.cancelQueries(['jobs']);
      const previousJobs = queryClient.getQueryData<Job[]>(['jobs']);
      previousJobs && queryClient.setQueryData(
        ['jobs'], 
        previousJobs.map(job => job.id !== updatedJob.id ? job : updatedJob)
      );
      return previousJobs;
    },
    onError: (err, updatedJob, context) => {
      queryClient.setQueryData(['jobs'], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });

  const formSchema = z.object({
    id: z.number(),
    address: z.string().min(1),
    status: z.nativeEnum(Status),
    lockStatus: z.string(),
    shelvingStatus: z.string(),
    showerStatus: z.string(),
    mirrorStatus: z.string(),
    contractor: z.object({
      id: z.number(),
      companyName: z.string().min(1),
      contactName: z.string().min(1),
      phoneNumber: z.string().regex(new RegExp('[0-9]{3}.[0-9]{3}.[0-9]{4}')),
      email: z.string().min(1).email(),
    }),
    jobSiteAccess: z.string(),
  });

  const { register, handleSubmit, control, formState: { isValid } } = useForm<JobFormData>({
    defaultValues: {
      id: job ? job.id : 0,
      address: job ? job.address : '',
      status: job ? job.status : Status.UPCOMING,
      lockStatus: job ? job.lockStatus : '',
      shelvingStatus: job ? job.shelvingStatus : '',
      showerStatus: job ? job.showerStatus : '',
      mirrorStatus: job ? job.mirrorStatus : '',
      contractor: job ? job.contractor : undefined,
      jobSiteAccess: job ? job.jobSiteAccess : '',
    },
    resolver: zodResolver(formSchema),
  });

  const { field: { value: statusValue, onChange: onStatusChange } } = useController({ 
    name: 'status', control 
  });

  const { field: { value: contractorValue, onChange: onContractorChange } } = useController({ 
    name: 'contractor', control
  });

  const [photoData, setPhotoData] = useState<PhotoFormData>({ 
    takeoffOne: null, takeoffTwo:null 
  });

  const handleChangePhoto = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.target.files && setPhotoData({ 
      ...photoData, [evt.target.name]: evt.target.files.item(0) 
    });
  }

  const onSubmit: SubmitHandler<JobFormData> = async data => {
    handleScroll();
    try {
      if (!job) {
        createJob.mutate(data);
        setIsJobFormOpen && setIsJobFormOpen(false);
      } else {
        updateJob?.mutate(data);
        setIsBeingEdited && setIsBeingEdited(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleCancelFunctions = () => {
    handleScroll();
    if (!job) {
      setIsJobFormOpen && setIsJobFormOpen(false);
    } else {
      setIsBeingEdited && setIsBeingEdited(false);
    }
  }

  const statusOptions = Object.values(Status).map(role => {
    const obj: SelectOption = { value: '', label: ''};
    obj.value = role;
    obj.label = role;
    return obj;
  });

  const contractorOptions = contractors?.map(contractor => {
    const obj: SelectOption = { value: '', label: ''};
    obj.value = contractor.companyName;
    obj.label = contractor.companyName;
    return obj;
  });

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      {user.role !== Role.ADMIN ?
        <>
          <TableCell content={job?.status} width={8.5} />
          <TableCell content={job?.address} width={16.5} />
          <TableCell width={5} smallPadding>
            {job?.takeoffOne && <label><HiDocumentText /></label>}
            {job?.takeoffTwo && <label><HiDocumentText /></label>}
          </TableCell>
        </>
        :
        <>
          <Controller name="status" control={control} render={() => (
              <Select 
                className={selectStyles.mediumContainer}
                isSearchable={false}
                options={statusOptions} 
                value={statusOptions.find(option => option.value === statusValue)}
                onChange={(option: SingleValue<any>) => onStatusChange(option.value)}
              />
            )}
          />
          <Input name="address" register={register} placeholder="Address" width={16} />
          <TableCell width={5} smallPadding>
            <label htmlFor={`takeoffOne${job?.id}`}>
              {!photoData.takeoffOne ? <HiDocumentPlus /> : <HiDocumentCheck />}
            </label>
            <input 
              type="file" id={`takeoffOne${job?.id}`} 
              name="takeoffOne" onChange={handleChangePhoto} 
            />
            <label htmlFor={`takeoffTwo${job?.id}`}>
              {!photoData.takeoffTwo ? <HiDocumentPlus /> : <HiDocumentCheck />}
            </label>
            <input 
              type="file" id={`takeoffTwo${job?.id}`} 
              name="takeoffTwo" onChange={handleChangePhoto} 
            />
          </TableCell>
        </>
      }
      <Input name="lockStatus" register={register} placeholder="Lock Status" width={16} />
      <Input name="shelvingStatus" register={register} placeholder="Shelving Status" width={16} />
      <Input name="showerStatus" register={register} placeholder="Shower Status" width={16} />
      <Input name="mirrorStatus" register={register} placeholder="Mirror Status" width={16} />
      {user.role !== Role.ADMIN ?
        <>
          <TableCell content={job?.contractor.companyName} width={16.5} />
          <TableCell content={job?.jobSiteAccess} width={12.5} />
        </>
        :
        <>
          <Controller name="contractor" control={control} render={() => (
              <Select 
                className={selectStyles.largeContainer}
                isSearchable
                options={contractorOptions} 
                value={
                  contractorOptions?.find(option => option.value === contractorValue?.companyName)
                }
                onChange={(option: SingleValue<any>) => onContractorChange(
                  contractors?.find(contractor => contractor.companyName === option.value)
                )}
                placeholder="Builder"
              />
            )}
          />
          <Input name="jobSiteAccess" register={register} placeholder="Job Site Access" width={12} />
        </>
      }
      <ButtonContainer small>
        <Button disabled={!isValid} icon={<TiPlus />} />
        <Button onClick={handleCancelFunctions} icon={<TiCancel />} />
      </ButtonContainer>
    </form>
  );
}

export default JobForm;