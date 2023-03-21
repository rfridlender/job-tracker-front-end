import { Navigate } from 'react-router-dom';
import { User } from '../../types/models';
import styles from './Landing.module.scss';

interface LandingProps {
  user: User | null;
}
const Landing = (props: LandingProps): JSX.Element => {
  const { user } = props;

  if (user) {
    return (
      <Navigate to="/jobs" />
    );
  } else {
    return (
      <main className={styles.container}>
        <h1>Please log in</h1>
      </main>
    );
  }
}

export default Landing;
