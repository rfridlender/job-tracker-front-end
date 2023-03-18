import { useState } from 'react';
import styles from './JobForm.module.scss';
import * as jobService from '../../services/jobService';
import { JobFormData, PhotoFormData } from '../../types/forms';
import { Status } from '../../types/enums';
import { Contractor } from '../../types/models';

const JobForm = (): JSX.Element => {
  const [photoData, setPhotoData] = useState<PhotoFormData>({ photo: null });
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [formData, setFormData] = useState<JobFormData>({
    address: '',
    status: Status.UPCOMING,
    lockStatus: '',
    shelvingStatus: '',
    showerStatus: '',
    mirrorStatus: '',
    contractor: null,
    jobSiteAccess: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    if(isSubmitted) return;
    try {
      setIsSubmitted(true);
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
      {/* <select className={styles.inputContainer} name="contractor" id="contractor" onChange={handleChange} required>
        {.map((contractor, idx) => (
          <option key={contractor} value={contractor}>{contractor.companyName}</option>
        ))}
      </select> */}
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
