import styles from './BarContainer.module.scss';
import { ReactNode } from 'react';

interface BarContainerProps {
  children: ReactNode;
  noPadding?: boolean;
}

const BarContainer = (props: BarContainerProps) => {
  const { children, noPadding } = props;

  return (
    <div className={!noPadding ? styles.container : styles.noPaddingContainer}>
      {children}
    </div>
  );
}
 
export default BarContainer;