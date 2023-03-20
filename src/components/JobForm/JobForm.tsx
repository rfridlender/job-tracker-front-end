import { useState } from 'react';
import styles from './JobForm.module.scss';
import * as jobService from '../../services/jobService';
import { JobFormData, PhotoFormData } from '../../types/forms';
import { Status } from '../../types/enums';
import { Contractor, Job } from '../../types/models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface JobFormProps {
  contractors: Contractor[] | undefined;
}

const JobForm = (props: JobFormProps): JSX.Element => {
  const { contractors } = props;

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
      setFormData({ 
        id: 0,
        address: '',
        status: Status.UPCOMING,
        lockStatus: '',
        shelvingStatus: '',
        showerStatus: '',
        mirrorStatus: '',
        contractor: undefined,
        jobSiteAccess: '', 
      });
      setContractorFormData('');
      setPhotoData({ photo: null });
      setIsSubmitted(false);
    },
  });

  const [formData, setFormData] = useState<JobFormData>({
    id: 0,
    address: '',
    status: Status.UPCOMING,
    lockStatus: '',
    shelvingStatus: '',
    showerStatus: '',
    mirrorStatus: '',
    contractor: undefined,
    jobSiteAccess: '',
  });
  const [contractorFormData, setContractorFormData] = useState<string>('');
  const [photoData, setPhotoData] = useState<PhotoFormData>({ photo: null });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
    if(isSubmitted) return;
    try {
      setIsSubmitted(true);
      createJob.mutate(formData);
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

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <select className={styles.inputContainer} name="status" id="status" onChange={handleChange} value={status} disabled={isSubmitted}>
        {Object.values(Status).map((status, idx) => (
          <option key={status} value={status}>{idx + 1}. {status}</option>
        ))}
      </select>
      <input
        className={styles.inputContainer} type="text" id="address" value={address} name="address" onChange={handleChange} placeholder="Address" disabled={isSubmitted}
      />
      <div className={styles.inputContainer} id={styles.photoUpload}>
        <label htmlFor="photo-upload" className={photoData.photo?.name && styles.active}>{!photoData.photo ? 'Add Takeoff' : photoData.photo.name}</label>
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
        placeholder="Lock Status" disabled={isSubmitted}
      />
      <input
        className={styles.inputContainer} type="text" id="shelvingStatus" 
        value={shelvingStatus} name="shelvingStatus" onChange={handleChange} 
        placeholder="Shelving Status" disabled={isSubmitted}
      />
      <input
        className={styles.inputContainer} type="text" id="showerStatus" 
        value={showerStatus} name="showerStatus" onChange={handleChange} 
        placeholder="Shower Status" disabled={isSubmitted}
      />
      <input
        className={styles.inputContainer} type="text" id="mirrorStatus" 
        value={mirrorStatus} name="mirrorStatus" onChange={handleChange} 
        placeholder="Mirror Status" disabled={isSubmitted}
      />
      <select className={styles.inputContainer} name="contractor" id="contractor" onChange={handleChange} value={contractorFormData} disabled={isSubmitted}>
          <option value="">Builder</option>
        {contractors?.map(contractor => (
          <option key={contractor.id} value={contractor.id}>{contractor.companyName}</option>
        ))}
      </select>
      <input
        className={styles.inputContainer} type="text" id="jobSiteAccess" 
        value={jobSiteAccess} name="jobSiteAccess" onChange={handleChange} 
        placeholder="Job Site Access" disabled={isSubmitted}
      />
      <button disabled={isFormInvalid() || isSubmitted} className={styles.button}>
        Plus Icon
      </button>
    </form>
  );
}

export default JobForm;