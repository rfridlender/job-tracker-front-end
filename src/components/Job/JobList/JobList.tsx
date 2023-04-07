import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Job, User } from '../../../types/models';
import * as contractorService from '../../../services/contractorService';
import * as jobService from '../../../services/jobService';
import styles from './JobList.module.scss'
import JobForm from '../JobForm/JobForm';
import JobCard from '../JobCard/JobCard';
import { Status } from '../../../types/enums';
import { useRef, useState } from 'react';
import { AiOutlineClose, AiOutlineSearch, AiOutlineFilter } from 'react-icons/ai';
import JobHeader from '../JobHeader/JobHeader';
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import SearchBar from '../../UI/SearchBar/SearchBar';
import { SelectOption } from '../../../types/props';
import FilterBar from '../../UI/FilterBar/FilterBar';
import BarContainer from '../../UI/BarContainer/BarContainer';

interface JobListProps {
  user: User;
}

const JobList = (props: JobListProps) => {
  const { user } = props;
  
  const queryClient = useQueryClient();

  const contractorQuery = useQuery(['contractors'], contractorService.index);
  const jobQuery = useQuery<Job[]>(['jobs'], jobService.index);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
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

  const options = contractors?.map(contractor => {
    const obj: SelectOption = { value: '', label: ''};
    obj.value = contractor.companyName;
    obj.label = contractor.companyName;
    return obj;
  });
  
  const filteredJobs = jobQuery.data?.filter(job => 
    job.contractor.companyName.includes(filter)
  );
  
  const searchedJobs = filteredJobs?.filter(job => 
    job.address.toLowerCase().includes(search.toLowerCase())
  );
  
  const jobs = searchedJobs?.sort((a, b) => {
    return a.contractor.companyName > b.contractor.companyName ? 1 : -1;
  });

  return (
    <main className={styles.container}>
      <BarContainer>
        <SearchBar search={search} setSearch={setSearch} placeholder="Search by address" />
        <FilterBar 
          filter={filter} setFilter={setFilter} options={options} placeholder="Filter by builder" 
        />
      </BarContainer>
      <div 
        className={styles.scrollContainer} 
        ref={scrollContainer} 
        onMouseDown={onMouseDown} 
        onMouseUp={onMouseUp} 
        onMouseMove={onMouseMove} 
      >
        {!isJobFormOpen ?
          <JobHeader user={user} handleOpenJobForm={handleOpenJobForm} />
          :
          <JobForm 
            contractors={contractors} setIsJobFormOpen={setIsJobFormOpen} 
            user={user} handleScroll={handleScroll}
          />
        }
        {!jobs ?
          <div className={styles.loadingContainer}>
             <LoadingSpinner />
          </div>
          :
          Object.values(Status).map(status => (
            <section key={status} id={styles[status.toLowerCase()]}>
              {jobs?.filter(job => job.status === status).map(job => (
                <JobCard 
                  key={job.id} contractors={contractors} job={job} 
                  user={user} handleScroll={handleScroll}
                />
              ))}
            </section>
          ))
        }
      </div>
    </main>
  );
}
 
export default JobList;