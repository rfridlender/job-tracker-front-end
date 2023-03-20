import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Contractor } from '../../types/models';
import { ContractorFormData } from '../../types/forms';
import styles from './ContractorCard.module.scss';
import * as contractorService from '../../services/contractorService';
import { TiEdit } from 'react-icons/ti';
import ContractorForm from '../ContractorForm/ContractorForm';

interface ContractorCardProps {
  contractor: Contractor;
}

const ContractorCard = (props: ContractorCardProps) => {
  const { contractor } = props;
  
  const queryClient = useQueryClient();

  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const updateContractor = useMutation({
    mutationFn: (formData) => contractorService.update(contractor.id, formData),
    onMutate: async (updatedContractor: ContractorFormData) => {
      await queryClient.cancelQueries(['contractors']);
      const previousContractors = queryClient.getQueryData<Contractor[]>(['contractors']);
      previousContractors && queryClient.setQueryData(['contractors'], previousContractors.map(contractor => updatedContractor.id !== contractor.id ? contractor : updatedContractor));
      return previousContractors;
    },
    onError: (err, updatedContractor, context) => {
      queryClient.setQueryData(['contractors'], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contractors']);
    },
  });

  if (isBeingEdited) {
    return (
      <ContractorForm 
        setIsBeingEdited={setIsBeingEdited} 
        updateContractor={updateContractor} 
        contractor={contractor} 
      />
    );
  } else {
    return (
      <article className={styles.container}>
        <div>{contractor.companyName}</div>
        <div>{contractor.contactName}</div>
        <div>{contractor.phoneNumber}</div>
        <div>{contractor.email}</div>
        <TiEdit onClick={() => setIsBeingEdited(true)} />
      </article>
    );
  }
}
 
export default ContractorCard;