import styles from './Button.module.scss';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  icon?: JSX.Element | boolean;
  content?: string;
  accent?: boolean;
}

const Button = (props: ButtonProps) => {
  const { onClick, disabled, icon, content, accent } = props;

  return (
    <button 
      className={!content ? styles.smallButton : accent ? styles.bigAccentButton : styles.bigButton} 
      type={onClick ? 'button' : 'submit'} 
      onClick={onClick} 
      disabled={disabled}
    >
      {icon}
      {!!content && <span>{content}</span>}
    </button>
  );
}
 
export default Button;