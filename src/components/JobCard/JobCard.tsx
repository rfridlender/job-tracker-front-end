import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Contractor, Job, User } from '../../types/models';
import { JobFormData, PhotoFormData } from '../../types/forms';
import styles from './JobCard.module.scss';
import * as jobService from '../../services/jobService';
import { Status } from '../../types/enums';
import WorkLogList from '../WorkLogList/WorkLogList';
import WorkLogForm from '../WorkLogForm/WorkLogForm';

interface JobCardProps {
  contractors: Contractor[] | undefined;
  job: Job;
  user: User;
}

const JobCard = (props: JobCardProps) => {
  const { contractors, job, user } = props;
  const queryClient = useQueryClient();

  const [areJobDetailsOpen, setAreJobDetailsOpen] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isTakeoffOpen, setIsTakeoffOpen] = useState(false);
  const [photoData, setPhotoData] = useState<PhotoFormData>({ photo: null });
  const [formData, setFormData] = useState<JobFormData>({
    id: job.id,
    address: job.address,
    status: job.status,
    lockStatus: job.lockStatus,
    shelvingStatus: job.shelvingStatus,
    showerStatus: job.showerStatus,
    mirrorStatus: job.mirrorStatus,
    contractor: job.contractor,
    jobSiteAccess: job.jobSiteAccess,
  });
  const [contractorFormData, setContractorFormData] = useState<string>(job.contractor.id.toString());

  const updateJob = useMutation({
    mutationFn: () => jobService.update(job.id, formData, photoData),
    onMutate: async (updatedJob: JobFormData) => {
      await queryClient.cancelQueries(['jobs']);
      const previousJobs = queryClient.getQueryData<Job[]>(['jobs']);
      previousJobs && queryClient.setQueryData(['jobs'], previousJobs.map(job => job.id !== updatedJob.id ? job : updatedJob));
      return previousJobs;
    },
    onError: (err, updatedJob, context) => {
      queryClient.setQueryData(['jobs'], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });
  
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    if (evt.target.name !== 'contractor') {
      setFormData({ ...formData, [evt.target.name]: evt.target.value });
    } else {
      setContractorFormData(evt.target.value);
      setFormData({ ...formData, contractor: contractors?.find(contractor => contractor.id === parseInt(evt.target.value)) });
    }
  }

  const handleChangePhoto = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.target.files && setPhotoData({ photo: evt.target.files.item(0) })
  }
  
  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    try {
      updateJob.mutate(formData);
      setIsBeingEdited(false);
    } catch (err) {
      console.log(err);
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

  if (isBeingEdited) {
    return (
      <form autoComplete="off" onSubmit={handleSubmit} className={styles.editContainer}>
        <select 
          className={styles.inputContainer} name="status" id="status" 
          onChange={handleChange} required value={status}
        >
          {Object.values(Status).map((status, idx) => (
            <option key={status} value={status}>{idx + 1}. {status}</option>
          ))}
        </select>
        <input
          className={styles.inputContainer} type="text" id="address" 
          value={address} name="address" onChange={handleChange} 
          placeholder="Address"
        />
        <div className={styles.inputContainer} id={styles.photoUpload}>
          <label htmlFor="photo-upload" className={photoData.photo?.name && styles.active}>
            {!photoData.photo ? 'Add Takeoff' : photoData.photo.name}
          </label>
          <input
            type="file"
            id="photo-upload"
            name="photo"
            onChange={handleChangePhoto}
          />
        </div>
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
        <select 
          className={styles.inputContainer} name="contractor" id="contractor" 
          onChange={handleChange} value={contractorFormData}
        >
          {contractors?.map(contractor => (
            <option key={contractor.id} value={contractor.id}>{contractor.companyName}</option>
          ))}
        </select>
        <input
          className={styles.inputContainer} type="text" id="jobSiteAccess" 
          value={jobSiteAccess} name="jobSiteAccess" onChange={handleChange} 
          placeholder="Job Site Access"
        />
        <div>
          <button disabled={isFormInvalid()} className={styles.button}>Save</button>
          <div onClick={() => setIsBeingEdited(false)}>Cancel</div>
        </div>
      </form>
    );
  } else {
    return (
      <article className={styles.container}>
        <div id={styles.overview} onClick={() => setAreJobDetailsOpen(!areJobDetailsOpen)}>
          <div>{job.status}</div>
          <div>{job.address}</div>
          <div onClick={() => setIsTakeoffOpen(true)}>{job.takeoff && 'Takeoff'}</div>
          {isTakeoffOpen && 
            <div id={styles.takeoff} onClick={() => setIsTakeoffOpen(false)}>
              <img src={job.takeoff} alt={`${job.address}'s Takeoff`} />
            </div>
          }
          <div>{job.lockStatus}</div>
          <div>{job.shelvingStatus}</div>
          <div>{job.showerStatus}</div>
          <div>{job.mirrorStatus}</div>
          <div>{job.contractor.companyName}</div>
          <div>{job.jobSiteAccess}</div>
          <div onClick={() => setIsBeingEdited(true)}>Edit</div>
        </div>
        {areJobDetailsOpen && 
          <div id={styles.details}>
            <WorkLogList job={job} user={user} />
          </div>
        }
      </article>
    );
  }
}
 
export default JobCard;