import styles from './MessageOverlay.module.scss';
import { AiOutlineClose } from 'react-icons/ai';

interface MessageOverlayProps {
  setMessage: (message: string) => void;
  content: string;
  error?: boolean;
}

const MessageOverlay = (props: MessageOverlayProps) => {
  const { setMessage, content, error } = props

  return (
    <div 
      className={!error ? styles.container : styles.errorContainer} 
      onClick={() => setMessage('')}
    >
      <span>{content}</span>
      <AiOutlineClose />
    </div>
  );
}
 
export default MessageOverlay;