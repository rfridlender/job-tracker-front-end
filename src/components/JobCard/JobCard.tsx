import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Contractor, Job, User } from '../../types/models';
import styles from './JobCard.module.scss';
import * as jobService from '../../services/jobService';
import WorkLogList from '../WorkLogList/WorkLogList';
import { TiEdit, TiMinus } from 'react-icons/ti';
import { HiDocumentText } from 'react-icons/hi2';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import JobForm from '../JobForm/JobForm';
import { Role } from '../../types/enums';
import DeleteOverlay from '../DeleteOverlay/DeleteOverlay';

interface JobCardProps {
  contractors: Contractor[] | undefined;
  job: Job;
  user: User;
  handleScroll: () => void;
}

const JobCard = (props: JobCardProps) => {
  const { contractors, job, user, handleScroll } = props;

  const queryClient = useQueryClient();

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingDeleted, setIsBeingDeleted] = useState(false);
  const [isTakeoffOpen, setIsTakeoffOpen] = useState(0);
  const [areBuilderDetailsOpen, setAreBuilderDetailsOpen] = useState(false);
  const [areJobDetailsOpen, setAreJobDetailsOpen] = useState(false);

  const deleteJob = useMutation({
    mutationFn: () => jobService.delete(job.id),
    onMutate: async () => {
      await queryClient.cancelQueries(['jobs']);
      const previousJobs = queryClient.getQueryData<Job[]>(['jobs']);
      previousJobs && queryClient.setQueryData(
        ['jobs'], 
        job && previousJobs.filter(previousJob => previousJob.id !== job.id ? true : false)
      );
      return previousJobs;
    },
    onError: (err, updatedJob, context) => {
      queryClient.setQueryData(['jobs'], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });

  const handleDelete = () => {
    handleScroll();
    try {
      deleteJob.mutate();
      setIsBeingDeleted(false);
    } catch (err) {
      console.log(err);
    }
  }

  const handleEditJob = () => {
    setIsBeingEdited(true);
    handleScroll();
  }

  if (isBeingEdited) {
    return (
      <JobForm 
        contractors={contractors} job={job} setIsBeingEdited={setIsBeingEdited} 
        user={user} handleScroll={handleScroll}
      />
    );
  } else {
    return (
      <article className={styles.container}>
        <div className={styles.overviewContainer}>
          <div 
            className={styles.statusContainer} 
            id={styles[`${job.status.toLowerCase()}Container`]}
          >
            {job.status}
          </div>
          <div 
            className={styles.detailContainer} id={styles.addressContainer}
            onClick={() => setAreJobDetailsOpen(!areJobDetailsOpen)}
          >
            <div>{job.address}</div>
            {!areJobDetailsOpen ?
              <AiOutlineDown />
              :
              <AiOutlineUp />
            }
          </div>
          <div id={styles.takeoffContainer}>
            {job.takeoffOne && <HiDocumentText onClick={() => setIsTakeoffOpen(1)} />}
            {job.takeoffTwo && <HiDocumentText onClick={() => setIsTakeoffOpen(2)} />}
          </div>
          {!!isTakeoffOpen && 
            <div className={styles.takeoffOverlay} onClick={() => setIsTakeoffOpen(0)}>
              <img 
                src={isTakeoffOpen === 1 ? job.takeoffOne : job.takeoffTwo} 
                alt={`${job.address}'s Takeoff`} 
              />
            </div>
          }
          {job.lockStatus.toLowerCase() !== 'done' ? 
            <div>{job.lockStatus}</div> : <span>{job.lockStatus}</span>
          }
          {job.shelvingStatus.toLowerCase() !== 'done' ? 
            <div>{job.shelvingStatus}</div> : <span>{job.shelvingStatus}</span>
          }
          {job.showerStatus.toLowerCase() !== 'done' ? 
            <div>{job.showerStatus}</div> : <span>{job.showerStatus}</span>
          }
          {job.mirrorStatus.toLowerCase() !== 'done' ? 
            <div>{job.mirrorStatus}</div> : <span>{job.mirrorStatus}</span>
          }
          <div 
            className={styles.detailContainer} 
            onClick={() => setAreBuilderDetailsOpen(!areBuilderDetailsOpen)}
          >
            <div>{job.contractor.companyName}</div>
            {!areBuilderDetailsOpen ?
              <AiOutlineDown />
              :
              <AiOutlineUp />
            }
          </div>
          <div id={styles.accessContainer}>{job.jobSiteAccess}</div>
          <div className={styles.buttonContainer}>
            <TiEdit onClick={handleEditJob} />
            {user.role === Role.ADMIN && <TiMinus onClick={() => setIsBeingDeleted(true)} />}
          </div>
          {isBeingDeleted &&
            <DeleteOverlay 
              setIsBeingDeleted={setIsBeingDeleted} handleDelete={handleDelete} job={job} 
            />
          }
        </div>
        {areBuilderDetailsOpen &&
          <div className={styles.builderDetailsContainer}>
            <div>{job.contractor.companyName}</div>
            <div>{job.contractor.contactName}</div>
            <a href={`tel:+${job.contractor.phoneNumber.replaceAll('.', '')}`}>
              {job.contractor.phoneNumber}
            </a>
            <a href={`mailto:${job.contractor.email}`}>{job.contractor.email}</a>
          </div>
        }
        {areBuilderDetailsOpen && areJobDetailsOpen && 
          <div className={styles.detailsSpacer} />
        }
        {areJobDetailsOpen && 
          <WorkLogList job={job} user={user} handleScroll={handleScroll} />
        }
      </article>
    );
  }
}
 
export default JobCard;