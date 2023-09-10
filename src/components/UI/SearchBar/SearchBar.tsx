import styles from './SearchBar.module.scss';
import { Dispatch, SetStateAction } from 'react';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';

interface SearchBarProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  placeholder: string;
}

const SearchBar = (props: SearchBarProps) => {
  const { search, setSearch, placeholder } = props;

  return (
    <div className={styles.container}>
      <input placeholder={placeholder} value={search} onChange={(e) => setSearch(e.target.value)} />
      <div />
      {!search ? <AiOutlineSearch /> : <AiOutlineClose onClick={() => setSearch('')}/>}
    </div>
  );
}
 
export default SearchBar;