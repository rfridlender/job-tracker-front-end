import { Path, UseFormRegister } from 'react-hook-form';
import styles from './Input.module.scss';

interface InputProps {
  type?: string;
  name: Path<any>;
  register: UseFormRegister<any>;
  placeholder: string;
  width?: number;
}

const Input = (props: InputProps) => {
  const { type, name, register, placeholder, width } = props;

  const inputStyle = {
    width: `${width}rem`,
    minWidth: `${width}rem`,
  }

  return ( 
    <input 
      className={styles.container}
      type={type ? type : 'text'} 
      {...register(name)} 
      placeholder={placeholder} 
      style={!width ? {} : inputStyle} 
    /> 
  );
}
 
export default Input;