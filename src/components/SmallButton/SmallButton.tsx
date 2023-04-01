import styles from './SmallButton.module.scss';

interface SmallButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  icon: JSX.Element | boolean;
}

const SmallButton = (props: SmallButtonProps) => {
  const { onClick, disabled, icon } = props;

  return (
    <button 
      className={styles.container} 
      type={onClick ? 'button' : 'submit'} 
      onClick={onClick} 
      disabled={disabled}
    >
      {icon}
    </button>
  );
}
 
export default SmallButton;