import styles from './ErrorOverlay.module.scss';
import { AiOutlineClose } from 'react-icons/ai';

interface ErrorOverlayProps {
  setIsErrorOverlayOpen: (boolean: boolean) => void;
  content: string;
}

const ErrorOverlay = (props: ErrorOverlayProps) => {
  const { setIsErrorOverlayOpen, content } = props

  return (
    <div className={styles.container} onClick={() => setIsErrorOverlayOpen(false)}>
      <span>{content}</span>
      <AiOutlineClose />
    </div>
  );
}
 
export default ErrorOverlay;