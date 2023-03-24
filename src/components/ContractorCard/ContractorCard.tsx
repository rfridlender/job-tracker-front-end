import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Contractor } from '../../types/models';
import styles from './ContractorCard.module.scss';
import { TiEdit } from 'react-icons/ti';
import ContractorForm from '../ContractorForm/ContractorForm';

interface ContractorCardProps {
  contractor: Contractor;
  handleScroll: () => void;
}

const ContractorCard = (props: ContractorCardProps) => {
  const { contractor, handleScroll } = props;
  
  const queryClient = useQueryClient();

  const [isBeingEdited, setIsBeingEdited] = useState(false);


  const handleEditContractor = () => {
    setIsBeingEdited(true);
    handleScroll();
  }

  if (isBeingEdited) {
    return (
      <ContractorForm 
        contractor={contractor} setIsBeingEdited={setIsBeingEdited} 
        handleScroll={handleScroll} />
    );
  } else {
    return (
      <article className={styles.container}>
        <div>{contractor.companyName}</div>
        <div className={styles.nameContainer}>{contractor.contactName}</div>
        <a 
          className={styles.phoneContainer} 
          href={`tel:+${contractor.phoneNumber.replaceAll('.', '')}`}
        >
          {contractor.phoneNumber}
        </a>
        <a href={`mailto:${contractor.email}`}>{contractor.email}</a>
        <div className={styles.buttonContainer}>
          <TiEdit onClick={handleEditContractor} />
        </div>
      </article>
    );
  }
}
 
export default ContractorCard;