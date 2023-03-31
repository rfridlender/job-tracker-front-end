import { ReactNode, useState } from 'react';
import styles from './BigButton.module.scss';

interface BigButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  icon?: JSX.Element | boolean;
  content: string;
  accent?: boolean;
}

const BigButton = (props: BigButtonProps) => {
  const { onClick, disabled, icon, content, accent } = props;

  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  const colorAccent = '#8b0500';
  const colorAccentShadow = '#4b0500';
  const colorSecondary = '#6c757d';
  const colorSecondaryShadow = '#212529';

  const buttonStyle = {    
    backgroundColor: accent ? 
      !isHover ? colorAccent : colorAccentShadow :
      !isHover ? colorSecondary : colorSecondaryShadow,
  }

  return (
    <button 
      className={styles.container} 
      style={buttonStyle} 
      type={onClick ? 'button' : 'submit'} 
      onClick={onClick} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      {icon}
      <span>{content}</span>
    </button>
  );
}
 
export default BigButton;