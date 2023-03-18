import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Contractor, Job } from '../../types/models';
import { JobFormData, PhotoFormData } from '../../types/forms';
import styles from './JobCard.module.scss';
import * as jobService from '../../services/jobService';
import { Status } from '../../types/enums';

interface JobCardProps {
  contractors: Contractor[] | undefined;
  job: Job;
}

const JobCard = (props: JobCardProps) => {
  const { contractors, job } = props;
  const queryClient = useQueryClient();

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [photoData, setPhotoData] = useState<PhotoFormData>({ photo: null });
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [formData, setFormData] = useState<JobFormData>({
    id: job.id,
    address: job.address,
    status: job.status,
    lockStatus: job.lockStatus,
    shelvingStatus: job.shelvingStatus,
    showerStatus: job.showerStatus,
    mirrorStatus: job.mirrorStatus,
    contractor: job.contractor,
    jobSiteAccess: job.address,
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
      <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <input
        className={styles.inputContainer} type="text" id="address" value={address} name="address" onChange={handleChange} placeholder="Address"
      />
      <select className={styles.inputContainer} name="status" id="status" onChange={handleChange} required value={status}>
        {Object.values(Status).map((status, idx) => (
          <option key={status} value={status}>{idx + 1}. {status}</option>
        ))}
      </select>
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
      <select className={styles.inputContainer} name="contractor" id="contractor" onChange={handleChange} value={contractorFormData}>
        {contractors?.map(contractor => (
          <option key={contractor.id} value={contractor.id}>{contractor.companyName}</option>
        ))}
      </select>
      <input
        className={styles.inputContainer} type="text" id="jobSiteAccess" 
        value={jobSiteAccess} name="jobSiteAccess" onChange={handleChange} 
        placeholder="Job Site Access"
      />
      <button disabled={isFormInvalid()} className={styles.button}>
        Save
      </button>
      <div onClick={() => setIsBeingEdited(false)}>
        Cancel
      </div>
    </form>
    );
  } else {
    return (
      <article className={styles.container}>
        <div>{job.address}</div>
        <div>{job.status}</div>
        <div>{job.lockStatus}</div>
        <div>{job.shelvingStatus}</div>
        <div>{job.showerStatus}</div>
        <div>{job.mirrorStatus}</div>
        <div>{job.contractor.contactName}</div>
        <div>{job.jobSiteAccess}</div>
        <div>{job.createdBy}</div>
        <div onClick={() => setIsBeingEdited(true)}>Edit</div>
      </article>
    );
  }
}
 
export default JobCard;