import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { TiPlus } from 'react-icons/ti';
import * as contractorService from '../../services/contractorService';
import ContractorCard from '../ContractorCard/ContractorCard';
import ContractorForm from '../ContractorForm/ContractorForm';
import styles from './ContractorList.module.scss';

const ContractorList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['contractors'], contractorService.index);

  const [isContractorFormOpen, setIsContractorFormOpen] = useState(false);

  const contractors = data;

  return (
    <section className={styles.container}>
      <h2>CONTRACTORS</h2>
      {!isContractorFormOpen ?
        <header>
          <div>Company Name</div>
          <div>Contact Name</div>
          <div>Phone Number</div>
          <div>Email</div>
          <TiPlus onClick={() => setIsContractorFormOpen(true)} />
        </header>
        :
        <ContractorForm setIsContractorFormOpen={setIsContractorFormOpen} />
      }
      {contractors?.map(contractor => (
        <ContractorCard key={contractor.id} contractor={contractor} />
      ))}
    </section>
  );
}
 
export default ContractorList;