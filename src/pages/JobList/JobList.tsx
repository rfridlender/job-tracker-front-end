import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Job, User } from '../../types/models';
import * as contractorService from '../../services/contractorService';
import * as jobService from '../../services/jobService';
import styles from './JobList.module.scss'
import JobForm from '../../components/JobForm/JobForm';
import JobCard from '../../components/JobCard/JobCard';
import { Status } from '../../types/enums';

interface JobListProps {
  user: User;
}

const JobList = (props: JobListProps) => {
  const { user } = props;
  
  const queryClient = useQueryClient();

  const contractorQuery = useQuery(['contractors'], contractorService.index);
  const jobQuery = useQuery<Job[]>(['jobs'], jobService.index);
  
  const contractors = contractorQuery.data;
  const jobs = jobQuery.data;

  return (
    <main className={styles.container}>
      <h1>JOBS</h1>
      <JobForm contractors={contractors} />
      {Object.values(Status).map(status => (
        <section key={status} id={styles[status.toLowerCase()]}>
          <h2>{status}</h2>
          {jobs?.filter(job => job.status === status).map(job => (
            <JobCard key={job.id} contractors={contractors} job={job} />
          ))}
        </section>
      ))}
    </main>
  );
}
 
export default JobList;