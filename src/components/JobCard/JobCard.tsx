import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Job } from '../../types/models';
import { JobFormData } from '../../types/forms';
import styles from './JobCard.module.scss';
import * as jobService from '../../services/jobService';

interface JobCardProps {
  job: Job;
}

const JobCard = (props: JobCardProps) => {
  const { job } = props;
  const queryClient = useQueryClient();

  // const [isBeingEdited, setIsBeingEdited] = useState(false);
  // const [formData, setFormData] = useState<JobFormData>({

  // });

  // const updateJob = useMutation({
  //   mutationFn: (formData: JobFormData) => jobService.update(Job.id, formData),
  //   onMutate: async (updatedJob: JobFormData) => {
  //     await queryClient.cancelQueries(['Jobs']);
  //     const previousJobs = queryClient.getQueryData<Job[]>(['Jobs']);
  //     previousJobs && queryClient.setQueryData(['Jobs'], previousJobs.map(Job => updatedJob.id !== Job.id ? Job : updatedJob));
  //     return previousJobs;
  //   },
  //   onError: (err, updatedJob, context) => {
  //     queryClient.setQueryData(['Jobs'], context);
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries(['Jobs']);
  //   },
  // });

  // const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
  //   setFormData({ ...formData, [evt.target.name]: evt.target.value });
  // }

  // const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
  //   evt.preventDefault();
  //   try {
  //     updateJob.mutate(formData);
  //     setIsBeingEdited(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // const { companyName, contactName, phoneNumber, email } = formData;

  // const isFormInvalid = (): boolean => {
  //   return !(companyName && contactName && phoneNumber && email);
  // }

  // if (isBeingEdited) {
  //   return (
  //     <form className={styles.container} autoComplete="off" onSubmit={handleSubmit}>
  //       <input 
  //         className={styles.inputContainer} type="text" id="companyName"
  //         value={companyName} name="companyName" onChange={handleChange}
  //         autoComplete="off" placeholder="Company Name"
  //       />
  //       <input 
  //         className={styles.inputContainer} type="text" id="contactName" 
  //         value={contactName} name="contactName" onChange={handleChange} 
  //         autoComplete="off" placeholder="Contact Name"
  //       />
  //       <input 
  //         className={styles.inputContainer} type="text" id="phoneNumber" 
  //         value={phoneNumber} name="phoneNumber" onChange={handleChange} 
  //         autoComplete="off" placeholder="Phone Number"
  //       />
  //       <input 
  //         className={styles.inputContainer} type="text" id="email" 
  //         value={email} name="email" onChange={handleChange} 
  //         autoComplete="off" placeholder="Email"
  //       />
  //       <div>
  //         <button className={styles.button} disabled={isFormInvalid()}>
  //           Plus Icon
  //         </button>
  //         <div onClick={() => setIsBeingEdited(false)}>
  //           Cancel
  //         </div>
  //       </div>
  //     </form>
  //   );
  // } else {
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
        {/* <div onClick={() => setIsBeingEdited(true)}>Edit</div> */}
      </article>
    );
  // }
}
 
export default JobCard;