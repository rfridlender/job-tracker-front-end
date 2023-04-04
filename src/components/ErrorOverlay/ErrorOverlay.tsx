import styles from './ErrorOverlay.module.scss';
import { AiOutlineClose } from 'react-icons/ai';

interface ErrorOverlayProps {
  setMessage: (message: string) => void;
  content: string;
}

const ErrorOverlay = (props: ErrorOverlayProps) => {
  const { setMessage, content } = props

  return (
    <div className={styles.container} onClick={() => setMessage('')}>
      <span>{content}</span>
      <AiOutlineClose />
    </div>
  );
}
 
export default ErrorOverlay;