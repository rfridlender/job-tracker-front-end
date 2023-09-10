import { ReactNode } from 'react';
import styles from './TableCell.module.scss';

interface TableCellProps {
  content?: string;
  children?: ReactNode;
  width?: number;
  smallPadding?: boolean;
  onClick?: () => void;
  status?: string;
}

const TableCell = (props: TableCellProps) => {
  const { content, children, width, smallPadding, onClick, status } = props;

  const divStyle = {
    width: width ? `${width}rem` : '100%',
    minWidth: width ? `${width}rem` : '',
    padding: !smallPadding ? '0 .75rem' : '0 .25rem',
  };

  return (
    <div 
      className={styles.container} 
      style={divStyle} 
      onClick={onClick}
      id={status ? styles[status.toLowerCase()] : onClick ? styles.clickable : ''}
    >
      {content}
      {children}
    </div>
  );
}
 
export default TableCell;