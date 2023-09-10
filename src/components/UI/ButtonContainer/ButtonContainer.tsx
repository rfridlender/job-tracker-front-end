import { Children, ReactNode } from 'react';
import styles from './ButtonContainer.module.scss';

interface ButtonContainerProps {
  children: ReactNode;
  small?: boolean;
}

const ButtonContainer = (props: ButtonContainerProps) => {
  const { children, small } = props;

  return (
    <div id={!small ? styles.bigContainer : styles.smallContainer}>
      {children}
    </div>
  );
}
 
export default ButtonContainer;