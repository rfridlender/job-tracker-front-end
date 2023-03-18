import styles from './Landing.module.scss';

interface LandingProps {

}

const Landing = (props: LandingProps): JSX.Element => {
  const { } = props;
  
  return (
    <main className={styles.container}>
      <h1>Please sign in</h1>
    </main>
  );
}

export default Landing;
