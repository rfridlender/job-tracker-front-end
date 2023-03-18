import { useState } from 'react';
import styles from './JobForm.module.scss';
import * as jobService from '../../services/jobService';
import * as contractorService from '../../services/contractorService';
import { JobFormData, PhotoFormData } from '../../types/forms';
import { Status } from '../../types/enums';
import { Contractor } from '../../types/models';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const JobForm = (): JSX.Element => {
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery(['contractors'], contractorService.index);
  
  const contractors = data;
  
  const [photoData, setPhotoData] = useState<PhotoFormData>({ photo: null });
  const [photoPreview, setPhotoPreview] = useState<string>('');
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    if (evt.target.name !== 'contractor') {
      setFormData({ ...formData, [evt.target.name]: evt.target.value });
    } else {
      setFormData({ ...formData, contractor: contractors?.find(contractor => contractor.id === parseInt(evt.target.value)) });
    }
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    if(isSubmitted) return;
    try {
      setIsSubmitted(true);
      console.log(formData);
      await jobService.create(formData, photoData);
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
      <input
        className={styles.inputContainer} type="text" id="address" value={address} name="address" onChange={handleChange} placeholder="Address"
      />
      <select className={styles.inputContainer} name="status" id="status" onChange={handleChange} required>
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
      <select className={styles.inputContainer} name="contractor" id="contractor" onChange={handleChange} required>
      <option defaultValue={undefined}>Builder</option>
        {contractors?.map(contractor => (
          <option key={contractor.id} value={contractor.id}>{contractor.companyName}</option>
        ))}
      </select>
      <input
        className={styles.inputContainer} type="text" id="jobSiteAccess" 
        value={jobSiteAccess} name="jobSiteAccess" onChange={handleChange} 
        placeholder="Job Site Access"
      />
      <button disabled={isFormInvalid() || isSubmitted} className={styles.button}>
        Plus Icon
      </button>
    </form>
  );
}

export default JobForm;