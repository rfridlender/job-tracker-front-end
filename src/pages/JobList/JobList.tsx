import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Job, User } from '../../types/models';
import * as jobService from '../../services/jobService'
import styles from './JobList.module.scss'

interface JobListProps {
  user: User;
}

const JobList = (props: JobListProps) => {
  const { user } = props;
  const queryClient = useQueryClient();

  const jobsQuery = useQuery<Job[]>(['jobs'], jobService.index);

  return (
    <main>
      {jobsQuery.data?.map((job: Job) => (<>{job.address}</>))}
    </main>
  );
}
 
export default JobList;