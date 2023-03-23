import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Contractor } from '../../types/models';
import styles from './ContractorCard.module.scss';
import { TiEdit } from 'react-icons/ti';
import ContractorForm from '../ContractorForm/ContractorForm';

interface ContractorCardProps {
  contractor: Contractor;
}

const ContractorCard = (props: ContractorCardProps) => {
  const { contractor } = props;
  
  const queryClient = useQueryClient();

  const [isBeingEdited, setIsBeingEdited] = useState(false);

  if (isBeingEdited) {
    return (
      <ContractorForm contractor={contractor} setIsBeingEdited={setIsBeingEdited} />
    );
  } else {
    return (
      <article className={styles.container}>
        <div>{contractor.companyName}</div>
        <div>{contractor.contactName}</div>
        <div>{contractor.phoneNumber}</div>
        <div>{contractor.email}</div>
        <div className={styles.buttonContainer}>
          <TiEdit onClick={() => setIsBeingEdited(true)} />
        </div>
      </article>
    );
  }
}
 
export default ContractorCard;