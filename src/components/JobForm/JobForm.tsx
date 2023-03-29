import { useState } from 'react';
import styles from './JobForm.module.scss';
import * as jobService from '../../services/jobService';
import { JobFormData, PhotoFormData } from '../../types/forms';
import { Role, Status } from '../../types/enums';
import { Contractor, Job, User } from '../../types/models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TiPlus, TiCancel } from 'react-icons/ti';
import { HiDocumentPlus, HiDocumentCheck, HiDocumentText } from 'react-icons/hi2';

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
    mutationFn: () => jobService.create(formData, photoData),
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
    mutationFn: () => jobService.update(formData.id, formData, photoData),
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

  const [formData, setFormData] = useState<JobFormData>({
    id: job ? job.id : 0,
    address: job ? job.address : '',
    status: job ? job.status : Status.UPCOMING,
    lockStatus: job ? job.lockStatus : '',
    shelvingStatus: job ? job.shelvingStatus : '',
    showerStatus: job ? job.showerStatus : '',
    mirrorStatus: job ? job.mirrorStatus : '',
    contractor: job ? job.contractor : undefined,
    jobSiteAccess: job ? job.jobSiteAccess : '',
  });
  const [contractorFormData, setContractorFormData] = useState<string>(
    job ? job.contractor.id.toString() : ''
  );
  const [photoData, setPhotoData] = useState<PhotoFormData>({ 
    takeoffOne: null, takeoffTwo:null 
  });
  
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (evt.target.name !== 'contractor') {
      setFormData({ ...formData, [evt.target.name]: evt.target.value });
    } else {
      setContractorFormData(evt.target.value);
      setFormData({ 
        ...formData, 
        contractor: contractors?.find(
          contractor => contractor.id === parseInt(evt.target.value)
        ), 
      });
    }
  }

  const handleChangePhoto = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.target.files && setPhotoData({ 
      ...photoData, [evt.target.name]: evt.target.files.item(0) 
    });
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    handleScroll();
    try {
      if (!job) {
        createJob.mutate(formData);
        setIsJobFormOpen && setIsJobFormOpen(false);
      } else {
        updateJob?.mutate(formData);
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

  const { 
    address, status, 
    lockStatus, shelvingStatus, showerStatus, mirrorStatus, 
    contractor, jobSiteAccess
  } = formData;

  const isFormInvalid = (): boolean => {
    return !(address && status && contractor);
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      {user.role !== Role.ADMIN ?
        <>
          <div className={styles.inputContainer}>{job?.status}</div>
          <div className={styles.inputContainer}>{job?.address}</div>
          <div className={styles.inputContainer} id={styles.takeoffContainer}>
            {job?.takeoffOne ? 
              <HiDocumentText /> : <div />
            }
            {job?.takeoffTwo ? 
              <HiDocumentText /> : <div />
            }
          </div>
        </>
        :
        <>
          <select 
            className={styles.inputContainer} name="status" id="status" 
            onChange={handleChange} value={status}
          >
            {Object.values(Status).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <input
            className={styles.inputContainer} type="text" id="address" 
            value={address} name="address" onChange={handleChange} 
            placeholder="Address"
          />
          <div className={styles.inputContainer} id={styles.takeoffContainer}>
            <label 
              htmlFor="takeoffOne" className={photoData.takeoffOne?.name && styles.active}
            >
              {!photoData.takeoffOne ? <HiDocumentPlus /> : <HiDocumentCheck />}
            </label>
            <input
              type="file"
              id="takeoffOne"
              name="takeoffOne"
              onChange={handleChangePhoto}
            />
            <label 
              htmlFor="takeoffTwo" className={photoData.takeoffTwo?.name && styles.active}
            >
              {!photoData.takeoffTwo ? <HiDocumentPlus /> : <HiDocumentCheck />}
            </label>
            <input
              type="file"
              id="takeoffTwo"
              name="takeoffTwo"
              onChange={handleChangePhoto}
            />
          </div>
        </>
      }
      <input
        className={styles.inputContainer} type="text" id="lockStatus" 
        value={lockStatus} name="lockStatus" onChange={handleChange} 
        placeholder="Lock Status"
      />
      <input
        className={styles.inputContainer} type="text" id="shelvingStatus" 
        value={shelvingStatus} name="shelvingStatus" onChange={handleChange} 
        placeholder="Shelving Status"
      />
      <input
        className={styles.inputContainer} type="text" id="showerStatus" 
        value={showerStatus} name="showerStatus" onChange={handleChange} 
        placeholder="Shower Status"
      />
      <input
        className={styles.inputContainer} type="text" id="mirrorStatus" 
        value={mirrorStatus} name="mirrorStatus" onChange={handleChange} 
        placeholder="Mirror Status"
      />
      {user.role !== Role.ADMIN ?
        <>
          <div className={styles.inputContainer}>{job?.contractor.companyName}</div>
          <div className={styles.inputContainer} id={styles.accessContainer}>
            {job?.jobSiteAccess}
          </div>
        </>
        :
        <>
          <select 
            className={styles.inputContainer} name="contractor" id="contractor" 
            onChange={handleChange} value={contractorFormData}
          >
              <option value="">Builder</option>
            {contractors?.map(contractor => (
              <option key={contractor.id} value={contractor.id}>
                {contractor.companyName}
              </option>
            ))}
          </select>
          <input
            className={styles.inputContainer} type="text" id={styles.accessContainer}
            value={jobSiteAccess} name="jobSiteAccess" onChange={handleChange} 
            placeholder="Job Site Access"
          />
        </>
      }
      <div className={styles.buttonContainer}>
        <button disabled={isFormInvalid()}>
          <TiPlus />
        </button>
        <div onClick={handleCancelFunctions}>
          <TiCancel />
        </div>
      </div>
    </form>
  );
}

export default JobForm;