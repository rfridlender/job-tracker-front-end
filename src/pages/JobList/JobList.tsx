import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Job, User } from '../../types/models';
import * as contractorService from '../../services/contractorService';
import * as jobService from '../../services/jobService';
import styles from './JobList.module.scss'
import JobForm from '../../components/JobForm/JobForm';
import JobCard from '../../components/JobCard/JobCard';
import { Role, Status } from '../../types/enums';
import { MouseEventHandler, ReactNode, useRef, useState } from 'react';
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
  const [scrollState, setScrollState] = useState({ 
    isScrolling: false, clientX: 0, scrollX: 0,
  });

  const scrollContainer = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  const handleOpenJobForm = () => {
    setIsJobFormOpen(true);
    handleScroll();
  }

  const onMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
    setScrollState({ ...scrollState, isScrolling: true, clientX: evt.clientX });
    if (scrollContainer.current) {
      scrollContainer.current.style.cursor = 'grabbing';
    }
  }

  const onMouseUp = (evt: React.MouseEvent<HTMLDivElement>) => {
    setScrollState({ ...scrollState, isScrolling: false });
    if (scrollContainer.current) {
      scrollContainer.current.style.cursor = 'default';
    }
  }

  const onMouseMove = (evt: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, scrollX } = scrollState;
    if (scrollState.isScrolling && scrollContainer.current) {
      scrollContainer.current.scrollLeft = (scrollX + evt.clientX - clientX) * -1;
      scrollState.scrollX = scrollX + evt.clientX - clientX;
      scrollState.clientX = evt.clientX;
    }
  }
  
  const contractors = contractorQuery.data;
  const jobs = jobQuery.data;

  return (
    <main className={styles.container}>
      <h2>Jobs</h2>
      <div 
        className={styles.scrollContainer} 
        ref={scrollContainer} 
        onMouseDown={onMouseDown} 
        onMouseUp={onMouseUp} 
        onMouseMove={onMouseMove} 
      >
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
                <TiPlus onClick={handleOpenJobForm} />
              }
            </div>
          </header>
          :
          <JobForm 
            contractors={contractors} setIsJobFormOpen={setIsJobFormOpen} 
            user={user} handleScroll={handleScroll}
          />
        }
        {Object.values(Status).map(status => (
          <section key={status} id={styles[status.toLowerCase()]}>
            {jobs?.filter(job => job.status === status).map(job => (
              <JobCard 
                key={job.id} contractors={contractors} job={job} 
                user={user} handleScroll={handleScroll}
              />
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
 
export default JobList;