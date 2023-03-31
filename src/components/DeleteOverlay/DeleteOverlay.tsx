import { Job, WorkLog, User } from '../../types/models';
import BigButton from '../BigButton/BigButton';
import styles from './DeleteOverlay.module.scss';

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
          <BigButton onClick={handleDelete} content="Delete" accent/>
          <BigButton onClick={() => setIsBeingDeleted(false)} content="Cancel" />
        </div>
      </section>
    </div>
  );
}
 
export default DeleteOverlay;