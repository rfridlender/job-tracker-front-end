import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as contractorService from '../../services/contractorService';
import ContractorCard from '../ContractorCard/ContractorCard';
import ContractorForm from '../ContractorForm/ContractorForm';
import styles from './ContractorList.module.scss';

const ContractorList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['contractors'], contractorService.index);

  const contractors = data;

  return (
    <section className={styles.container}>
      <h2>CONTRACTORS</h2>
      <ContractorForm />
      {contractors?.map(contractor => (
        <ContractorCard key={contractor.id} contractor={contractor} />
      ))}
    </section>
  );
}
 
export default ContractorList;