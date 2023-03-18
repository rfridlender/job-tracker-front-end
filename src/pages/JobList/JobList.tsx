import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Job, User } from '../../types/models';
import * as jobService from '../../services/jobService'
import styles from './JobList.module.scss'
import JobForm from '../../components/JobForm/JobForm';
import JobCard from '../../components/JobCard/JobCard';

interface JobListProps {
  user: User;
}

const JobList = (props: JobListProps) => {
  const { user } = props;
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Job[]>(['jobs'], jobService.index);

  const jobs = data;

  return (
    <main>
      <h1>JOBS</h1>
      <JobForm />
      {jobs?.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </main>
  );
}
 
export default JobList;