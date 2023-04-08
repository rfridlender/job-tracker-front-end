import { useState } from 'react';
import { Contractor, Job, User } from '../../../types/models';
import styles from './JobContainer.module.scss';
import WorkLogList from '../../WorkLog/WorkLogList/WorkLogList';
import ContractorDetails from '../ContractorDetails/ContractorDetails';
import JobCard from '../JobCard/JobCard';

interface JobContainerProps {
  contractors: Contractor[] | undefined;
  job: Job;
  user: User;
  handleScroll: () => void;
}

const JobContainer = (props: JobContainerProps) => {
  const { contractors, job, user, handleScroll } = props;

  const [areContractorDetailsOpen, setAreContractorDetailsOpen] = useState(false);
  const [areWorkLogDetailsOpen, setAreWorkLogDetailsOpen] = useState(false);

  return (
    <article className={styles.container} >
      <JobCard 
        {...props} 
        areContractorDetailsOpen={areContractorDetailsOpen} 
        setAreContractorDetailsOpen={setAreContractorDetailsOpen}
        areWorkLogDetailsOpen={areWorkLogDetailsOpen}
        setAreWorkLogDetailsOpen={setAreWorkLogDetailsOpen}
      />
      {areContractorDetailsOpen && <ContractorDetails contractor={job.contractor} />}
      {areContractorDetailsOpen && areWorkLogDetailsOpen && <div id={styles.divider} />}
      {areWorkLogDetailsOpen && <WorkLogList job={job} user={user} handleScroll={handleScroll} />}
    </article>
  );
}
 
export default JobContainer;