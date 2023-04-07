import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Contractor } from '../../../types/models';
import styles from './ContractorCard.module.scss';
import { TiEdit } from 'react-icons/ti';
import ContractorForm from '../ContractorForm/ContractorForm';
import Button from '../../UI/Button/Button';

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
        <a href={`tel:+${contractor.phoneNumber.replaceAll('.', '')}`}>
          {contractor.phoneNumber}
        </a>
        <a href={`mailto:${contractor.email}`}>{contractor.email}</a>
        <Button onClick={() => setIsBeingEdited(true)} icon={<TiEdit />} content="Edit" accent />
      </article>
    );
  }
}
 
export default ContractorCard;