import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Job, User } from '../../types/models';
import * as contractorService from '../../services/contractorService';
import * as jobService from '../../services/jobService';
import styles from './JobList.module.scss'
import JobForm from '../../components/JobForm/JobForm';
import JobCard from '../../components/JobCard/JobCard';
import { Role, Status } from '../../types/enums';
import { useState } from 'react';
import { TiPlus } from 'react-icons/ti';

interface JobListProps {
  user: User;
}

const JobList = (props: JobListProps) => {
  const { user } = props;
  
  const queryClient = useQueryClient();

  const contractorQuery = useQuery(['contractors'], contractorService.index);
  const jobQuery = useQuery<Job[]>(['jobs'], jobService.index);

  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  
  const contractors = contractorQuery.data;
  const jobs = jobQuery.data;

  return (
    <main className={styles.container}>
      <h2>Jobs</h2>
      {!isJobFormOpen ?
        <header>
          <div>Status</div>
          <div>Address</div>
          <div id={styles.takeoffContainer}>Takeoff</div>
          <div>Lock Status</div>
          <div>Shelving Status</div>
          <div>Shower Status</div>
          <div>Mirror Status</div>
          <div>Builder</div>
          <div>Job Site Access</div>
          <div className={styles.buttonContainer}>
            {user.role === Role.ADMIN &&
              <TiPlus onClick={() => setIsJobFormOpen(true)} />
            }
          </div>
        </header>
        :
        <JobForm contractors={contractors} setIsJobFormOpen={setIsJobFormOpen} user={user} />
      }
      {Object.values(Status).map(status => (
        <section key={status} id={styles[status.toLowerCase()]}>
          {jobs?.filter(job => job.status === status).map(job => (
            <JobCard key={job.id} contractors={contractors} job={job} user={user} />
          ))}
        </section>
      ))}
    </main>
  );
}
 
export default JobList;