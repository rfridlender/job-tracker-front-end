import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as jobService from '../../services/jobService';
import JobCard from '../JobCard/JobCard';
import JobForm from '../JobForm/JobForm';
import styles from './JobList.module.scss';

const JobList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['Jobs'], jobService.index);

  const jobs = data;

  return (
    <section className={styles.container}>
      <h2>JOBS</h2>
      <JobForm />
      {jobs?.map(Job => (
        <JobCard key={Job.id} Job={Job} />
      ))}
    </section>
  );
}
 
export default JobList;