import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MouseEvent, useState } from 'react';
import { Contractor, Job, User } from '../../../types/models';
import styles from './JobCard.module.scss';
import * as jobService from '../../../services/jobService';
import { TiEdit, TiMinus } from 'react-icons/ti';
import { HiDocumentText } from 'react-icons/hi2';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import JobForm from '../JobForm/JobForm';
import { Role } from '../../../types/enums';
import DeleteOverlay from '../../UI/DeleteOverlay/DeleteOverlay';
import Button from '../../UI/Button/Button';
import ButtonContainer from '../../UI/ButtonContainer/ButtonContainer';
import TableCell from '../../UI/TableCell/TableCell';

interface JobCardProps {
  contractors: Contractor[] | undefined;
  job: Job;
  user: User;
  handleScroll: () => void;
  areContractorDetailsOpen: boolean;
  setAreContractorDetailsOpen: (boolean: boolean) => void;
  areWorkLogDetailsOpen: boolean;
  setAreWorkLogDetailsOpen: (boolean: boolean) => void;
}

const JobCard = (props: JobCardProps) => {
  const { 
    contractors, job, user, handleScroll, 
    areContractorDetailsOpen, setAreContractorDetailsOpen, 
    areWorkLogDetailsOpen, setAreWorkLogDetailsOpen, 
  } = props;

  const queryClient = useQueryClient();

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isBeingDeleted, setIsBeingDeleted] = useState(false);
  const [isTakeoffOpen, setIsTakeoffOpen] = useState(0);

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

  const handleDoubleClick = (evt: MouseEvent<HTMLElement>) => {
    evt.detail === 2 && setIsBeingEdited(true);
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
      <div className={styles.container} onClick={handleDoubleClick}>
        <TableCell content={job.status} width={8.5} status={job.status} />
        <TableCell width={16.5} onClick={() => setAreWorkLogDetailsOpen(!areWorkLogDetailsOpen)}>
          <div>{job.address}</div>
          {!areWorkLogDetailsOpen ? <AiOutlineDown /> : <AiOutlineUp />}
        </TableCell>
        <ButtonContainer small>
            {job.takeoffOne && 
              <Button 
                onClick={() => setIsTakeoffOpen(1)} icon={<HiDocumentText />} 
              />
            }
            {job.takeoffTwo && 
              <Button 
                onClick={() => setIsTakeoffOpen(2)} icon={<HiDocumentText />} 
              />
            }
        </ButtonContainer>
        {!!isTakeoffOpen && 
          <div className={styles.takeoffOverlay} onClick={() => setIsTakeoffOpen(0)}>
            <img 
              src={isTakeoffOpen === 1 ? job.takeoffOne : job.takeoffTwo} 
              alt={`${job.address}'s Takeoff`} 
            />
          </div>
        }
        {job.lockStatus.toLowerCase() !== 'done' ? 
          <TableCell content={job.lockStatus} width={16.5} /> 
          : 
          <span>{job.lockStatus}</span>
        }
        {job.shelvingStatus.toLowerCase() !== 'done' ? 
          <TableCell content={job.shelvingStatus} width={16.5} /> 
          : 
          <span>{job.shelvingStatus}</span>
        }
        {job.showerStatus.toLowerCase() !== 'done' ? 
          <TableCell content={job.showerStatus} width={16.5} /> 
          : 
          <span>{job.showerStatus}</span>
        }
        {job.mirrorStatus.toLowerCase() !== 'done' ? 
          <TableCell content={job.mirrorStatus} width={16.5} /> 
          : 
          <span>{job.mirrorStatus}</span>
        }
        <TableCell 
          width={16.5} 
          onClick={() => setAreContractorDetailsOpen(!areContractorDetailsOpen)}
        >
          <div>{job.contractor.companyName}</div>
          {!areContractorDetailsOpen ? <AiOutlineDown /> : <AiOutlineUp />}
        </TableCell>
        <TableCell content={job.jobSiteAccess} width={12.5} />
        <ButtonContainer small>
          <Button onClick={handleEditJob} icon={<TiEdit />} />
          {user.role === Role.ADMIN && 
            <Button onClick={() => setIsBeingDeleted(true)} icon={<TiMinus />} />
          }
        </ButtonContainer>
        {isBeingDeleted &&
          <DeleteOverlay 
            setIsBeingDeleted={setIsBeingDeleted} handleDelete={handleDelete} job={job} 
          />
        }
      </div>
    );
  }
}
 
export default JobCard;