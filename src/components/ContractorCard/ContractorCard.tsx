import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Contractor } from '../../types/models';
import { ContractorFormData } from '../../types/forms';
import styles from './ContractorCard.module.scss';
import * as contractorService from '../../services/contractorService';

interface ContractorCardProps {
  contractor: Contractor;
}

const ContractorCard = (props: ContractorCardProps) => {
  const { contractor } = props;
  
  const queryClient = useQueryClient();

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [formData, setFormData] = useState<ContractorFormData>({
    id: contractor.id,
    companyName: contractor.companyName,
    contactName: contractor.contactName,
    phoneNumber: contractor.phoneNumber,
    email: contractor.email,
  });

  const updateContractor = useMutation({
    mutationFn: () => contractorService.update(contractor.id, formData),
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

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    try {
      updateContractor.mutate(formData);
      setIsBeingEdited(false);
    } catch (err) {
      console.log(err);
    }
  }

  const { companyName, contactName, phoneNumber, email } = formData;

  const isFormInvalid = (): boolean => {
    return !(companyName && contactName && phoneNumber && email);
  }

  if (isBeingEdited) {
    return (
      <form className={styles.container} autoComplete="off" onSubmit={handleSubmit}>
        <input 
          className={styles.inputContainer} type="text" id="companyName"
          value={companyName} name="companyName" onChange={handleChange}
          autoComplete="off" placeholder="Company Name"
        />
        <input 
          className={styles.inputContainer} type="text" id="contactName" 
          value={contactName} name="contactName" onChange={handleChange} 
          autoComplete="off" placeholder="Contact Name"
        />
        <input 
          className={styles.inputContainer} type="text" id="phoneNumber" 
          value={phoneNumber} name="phoneNumber" onChange={handleChange} 
          autoComplete="off" placeholder="Phone Number"
        />
        <input 
          className={styles.inputContainer} type="text" id="email" 
          value={email} name="email" onChange={handleChange} 
          autoComplete="off" placeholder="Email"
        />
        <div>
          <button className={styles.button} disabled={isFormInvalid()}>
            Plus Icon
          </button>
          <div onClick={() => setIsBeingEdited(false)}>
            Cancel
          </div>
        </div>
      </form>
    );
  } else {
    return (
      <article className={styles.container}>
        <div>{contractor.companyName}</div>
        <div>{contractor.contactName}</div>
        <div>{contractor.phoneNumber}</div>
        <div>{contractor.email}</div>
        <div onClick={() => setIsBeingEdited(true)}>Edit</div>
      </article>
    );
  }
}
 
export default ContractorCard;