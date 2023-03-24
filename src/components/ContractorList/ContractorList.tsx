import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { TiPlus } from 'react-icons/ti';
import * as contractorService from '../../services/contractorService';
import ContractorCard from '../ContractorCard/ContractorCard';
import ContractorForm from '../ContractorForm/ContractorForm';
import styles from './ContractorList.module.scss';

const ContractorList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['contractors'], contractorService.index);

  const [isContractorFormOpen, setIsContractorFormOpen] = useState(false);

  const scrollContainer = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  const handleOpenContractorForm = () => {
    setIsContractorFormOpen(true);
    handleScroll();
  }

  const contractors = data;

  return (
    <section className={styles.container}>
      <h2>Builders</h2>
      <div 
        className={styles.scrollContainer} 
        ref={scrollContainer} 
      >
        {!isContractorFormOpen ?
          <header>
            <div>Company Name</div>
            <div className={styles.nameContainer}>Contact Name</div>
            <div className={styles.phoneContainer}>Phone Number</div>
            <div>Email</div>
            <div className={styles.buttonContainer}>
              <TiPlus onClick={handleOpenContractorForm} />
            </div>
          </header>
          :
          <ContractorForm 
            setIsContractorFormOpen={setIsContractorFormOpen}
            handleScroll={handleScroll}
          />
        }
        {contractors?.map(contractor => (
          <ContractorCard 
            key={contractor.id} contractor={contractor} handleScroll={handleScroll}
          />
        ))}
      </div>
    </section>
  );
}
 
export default ContractorList;