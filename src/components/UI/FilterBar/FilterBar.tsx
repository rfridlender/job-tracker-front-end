import { Dispatch, SetStateAction } from 'react';
import styles from './FilterBar.module.scss';
import Select, { SingleValue } from 'react-select';
import { SelectOption } from '../../../types/props';

interface FilterBarProps {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  options?: SelectOption[];
  placeholder: string;
}

const FilterBar = (props: FilterBarProps) => {
  const { filter, setFilter, options, placeholder } = props;

  return (
      <Select 
        className={styles.container}
        options={options} 
        value={filter ? options?.find(option => option.value === filter) : filter}
        onChange={(option: SingleValue<any>) => setFilter(option ? option.value : '')}
        placeholder="Filter by builder"
        isClearable
      />
  );
}
 
export default FilterBar;