import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Contractor, Job, User } from '../../types/models';
import styles from './JobCard.module.scss';
import * as jobService from '../../services/jobService';
import WorkLogList from '../WorkLogList/WorkLogList';
import { TiEdit, TiMinus, TiDocumentText } from 'react-icons/ti';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import JobForm from '../JobForm/JobForm';
import { Role } from '../../types/enums';

interface JobCardProps {
  contractors: Contractor[] | undefined;
  job: Job;
  user: User;
}

const JobCard = (props: JobCardProps) => {
  const { contractors, job, user } = props;
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
        previousJobs.filter(previousJob => previousJob.id !== job.id ? true : false)
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
    try {
      deleteJob.mutate();
      setIsBeingDeleted(false);
    } catch (err) {
      console.log(err);
    }
  }

  if (isBeingEdited) {
    return (
      <JobForm 
        contractors={contractors} job={job} 
        setIsBeingEdited={setIsBeingEdited} user={user} 
      />
    );
  } else {
    return (
      <article className={styles.container}>
        <div id={styles.overview}>
          <div>{job.status}</div>
          <div onClick={() => setAreJobDetailsOpen(!areJobDetailsOpen)}>
            <div>{job.address}</div>
            {!areJobDetailsOpen ?
              <AiOutlineDown />
              :
              <AiOutlineUp />
            }
          </div>
          {!job.takeoffOne || !job.takeoffTwo ?
            <div />
            :
            <div>
              {job.takeoffOne ? 
                <TiDocumentText onClick={() => setIsTakeoffOpen(1)} /> : <div />
              }
              {job.takeoffTwo ? 
                <TiDocumentText onClick={() => setIsTakeoffOpen(2)} /> : <div />
              }
            </div>
          }
          {!!isTakeoffOpen && 
            <div id={styles.takeoff} onClick={() => setIsTakeoffOpen(0)}>
              <img 
                src={isTakeoffOpen === 1 ? job.takeoffOne : job.takeoffTwo} 
                alt={`${job.address}'s Takeoff`} 
              />
            </div>
          }
          <div>{job.lockStatus}</div>
          <div>{job.shelvingStatus}</div>
          <div>{job.showerStatus}</div>
          <div>{job.mirrorStatus}</div>
          <div onClick={() => setAreBuilderDetailsOpen(!areBuilderDetailsOpen)}>
            <div>{job.contractor.companyName}</div>
            {!areBuilderDetailsOpen ?
              <AiOutlineDown />
              :
              <AiOutlineUp />
            }
          </div>
          <div>{job.jobSiteAccess}</div>
          <div>
            <TiEdit onClick={() => setIsBeingEdited(true)} />
            {user.role !== Role.ADMIN ?
              <div />
              :
              <TiMinus onClick={() => setIsBeingDeleted(true)} />
            }
          </div>
          {isBeingDeleted &&
            <div id={styles.deleteOptions}>
              <section>
                <div>Are you sure you want to delete {job.address}?</div>
                <div>
                  <button onClick={handleDelete}>Delete</button>
                  <button onClick={() => setIsBeingDeleted(false)}>Cancel</button>
                </div>
              </section>
            </div>
          }
        </div>
        {areBuilderDetailsOpen &&
          <div id={styles.builderDetails}>
            <div>{job.contractor.companyName}</div>
            <div>{job.contractor.contactName}</div>
            <div>{job.contractor.phoneNumber}</div>
            <div>{job.contractor.email}</div>
          </div>
        }
        {areJobDetailsOpen && 
          <div id={styles.details}>
            <WorkLogList job={job} user={user} />
          </div>
        }
      </article>
    );
  }
}
 
export default JobCard;