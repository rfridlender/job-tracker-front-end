import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { TiPlus } from 'react-icons/ti';
import * as contractorService from '../../services/contractorService';
import ContractorCard from '../ContractorCard/ContractorCard';
import ContractorForm from '../ContractorForm/ContractorForm';
import styles from './ContractorList.module.scss';

const ContractorList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['contractors'], contractorService.index);

  const [search, setSearch] = useState('');

  const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(evt.target.value);
  }

  const searchedContractors = data?.filter(contractor => 
    contractor.companyName.toLowerCase().includes(search.toLowerCase()) ||
    contractor.contactName.toLowerCase().includes(search.toLowerCase()) ||
    contractor.phoneNumber.toLowerCase().includes(search.toLowerCase()) ||
    contractor.email.toLowerCase().includes(search.toLowerCase())
  );
  const contractors = searchedContractors?.sort((a, b) => {
    return a.companyName > b.companyName ? 1 : -1
  });

  return (
    <section className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.searchBar}>
          <input 
            type="text" placeholder="Search" 
            value={search} onChange={handleSearch} 
          />
          {!search ?
            <AiOutlineSearch />
            :
            <AiOutlineClose onClick={() => setSearch('')}/>
          }
        </div>
      </div>
      {!search && <ContractorForm />}
      {contractors?.map(contractor => (
        <ContractorCard key={contractor.id} contractor={contractor} />
      ))}
    </section>
  );
}
 
export default ContractorList;