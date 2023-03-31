import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Job, User, WorkLog } from '../../types/models';
import styles from './DeleteOverlay.module.scss';
import * as jobService from '../../services/jobService';
import * as workLogService from '../../services/workLogService';

interface DeleteOverlayProps {
  setIsBeingDeleted: (boolean: boolean) => void;
  handleDelete: () => void;
  job?: Job;
  workLog?: WorkLog;
  user?: User;
}

const DeleteOverlay = (props: DeleteOverlayProps) => {
  const { setIsBeingDeleted, handleDelete, job, workLog, user } = props;

  return (
    <div id={styles.container}>
      <section>
        <div>
        {
          job ? `Are you sure you want to delete ${job.address}?` :
          workLog ? `Are you sure you want to delete this work log from ${workLog.workDate}` :
          user ? `Are you sure you want to fire ${user.name}?` : ''
        }
        </div>
        <div>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={() => setIsBeingDeleted(false)}>Cancel</button>
        </div>
      </section>
    </div>
  );
}
 
export default DeleteOverlay;