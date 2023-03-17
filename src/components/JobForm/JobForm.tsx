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
      <div className={styles.inputContainer}>
        <label htmlFor="address" className={styles.label}>Address</label>
        <input
          type="text"
          id="address"
          value={address}
          name="address"
          onChange={handleChange}
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="status">Status</label>
        <select name="status" id="status" onChange={handleChange} required>
          {Object.values(Status).map((status, idx) => (
            <option key={idx} value={status}>{idx + 1}. {status}</option>
          ))}
        </select>
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="lockStatus" className={styles.label}>Lock Status</label>
        <input
          type="text"
          id="lockStatus"
          value={lockStatus}
          name="lockStatus"
          onChange={handleChange}
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="shelvingStatus" className={styles.label}>Shelving Status</label>
        <input
          type="text"
          id="shelvingStatus"
          value={shelvingStatus}
          name="shelvingStatus"
          onChange={handleChange}
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="showerStatus" className={styles.label}>Shower Status</label>
        <input
          type="text"
          id="showerStatus"
          value={showerStatus}
          name="showerStatus"
          onChange={handleChange}
        />
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="mirrorStatus" className={styles.label}>Mirror Status</label>
        <input
          type="text"
          id="mirrorStatus"
          value={mirrorStatus}
          name="mirrorStatus"
          onChange={handleChange}
        />
      </div>
      {/* <div className={styles.inputContainer}>
        <label htmlFor="contractor">contractor</label>
        <select name="contractor" id="contractor" onChange={handleChange} required>
          {.map((contractor, idx) => (
            <option key={contractor} value={contractor}>{contractor.companyName}</option>
          ))}
        </select>
      </div> */}
      <div className={styles.inputContainer}>
        <label htmlFor="jobSiteAccess" className={styles.label}>Job Site Access</label>
        <input
          type="text"
          id="jobSiteAccess"
          value={jobSiteAccess}
          name="jobSiteAccess"
          onChange={handleChange}
        />
      </div>
      <div>
        <button disabled={isFormInvalid() || isSubmitted} className={styles.button}>
          Plus Icon
        </button>
      </div>
    </form>
  );
}

export default JobForm;
