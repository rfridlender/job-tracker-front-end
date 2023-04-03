import styles from './ErrorContainer.module.scss';

interface ErrorContainerProps {
  content: string;
}

const ErrorContainer = (props: ErrorContainerProps) => {
  const { content } = props;

  return (
    <div className={styles.container} role="alert">{content}</div>
  );
}
 
export default ErrorContainer;