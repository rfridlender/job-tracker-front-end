import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { TiPlus } from 'react-icons/ti';
import * as contractorService from '../../services/contractorService';
import ContractorCard from '../ContractorCard/ContractorCard';
import ContractorForm from '../ContractorForm/ContractorForm';
import styles from './ContractorList.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import BarContainer from '../BarContainer/BarContainer';

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
      <BarContainer noPadding>
        <SearchBar search={search} setSearch={setSearch} placeholder="Search" />
      </BarContainer>
      {!search && <ContractorForm />}
      {contractors?.map(contractor => (
        <ContractorCard key={contractor.id} contractor={contractor} />
      ))}
    </section>
  );
}
 
export default ContractorList;