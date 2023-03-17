import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Job, User } from '../../types/models';
import * as jobService from '../../services/jobService'
import styles from './JobsIndex.module.scss'

interface JobsIndexProps {
  user: User;
}

const JobsIndex = (props: JobsIndexProps) => {
  const { user } = props;
  const queryClient = useQueryClient();

  const jobsQuery = useQuery<Job[]>(['jobs'], jobService.index);

  return (
    <main>
      {jobsQuery.data?.map((job: Job) => (<>{job.address}</>))}
    </main>
  );
}
 
export default JobsIndex;