import { useState } from 'react';
import styles from './ContractorForm.module.scss';
import * as contractorService from '../../services/contractorService';
import { ContractorFormData } from '../../types/forms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Contractor } from '../../types/models';

const ContractorForm = (): JSX.Element => {
  const queryClient = useQueryClient();

  const createContractor = useMutation({
    mutationFn: contractorService.create,
    onMutate: async (newContractor: ContractorFormData) => {
      await queryClient.cancelQueries(['contractors']);
      const previousContractors = queryClient.getQueryData<Contractor[]>(['contractors']);
      previousContractors && queryClient.setQueryData(['contractors'], [newContractor, ...previousContractors]);
      return previousContractors;
    },
    onError: (err, newContractor, context) => {
      queryClient.setQueryData(['contractors'], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contractors']);
      setFormData({ id: 0, companyName: '', contactName: '', phoneNumber: '', email: '' });
      setIsSubmitted(false);
    },
  });

  const [formData, setFormData] = useState<ContractorFormData>({
    id: 0,
    companyName: '',
    contactName: '',
    phoneNumber: '',
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    if(isSubmitted) return;
    try {
      setIsSubmitted(true);
      createContractor.mutate(formData);
    } catch (err) {
      console.log(err);
    }
  }

  const { companyName, contactName, phoneNumber, email } = formData;

  const isFormInvalid = (): boolean => {
    return !(companyName && contactName && phoneNumber && email);
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <input 
        className={styles.inputContainer} type="text" id="companyName"
        value={companyName} name="companyName" onChange={handleChange}
        autoComplete="off" placeholder="Company Name" disabled={isSubmitted}
      />
      <input 
        className={styles.inputContainer} type="text" id="contactName" 
        value={contactName} name="contactName" onChange={handleChange} 
        autoComplete="off" placeholder="Contact Name" disabled={isSubmitted}
      />
      <input 
        className={styles.inputContainer} type="text" id="phoneNumber" 
        value={phoneNumber} name="phoneNumber" onChange={handleChange} 
        autoComplete="off" placeholder="Phone Number" disabled={isSubmitted}
      />
      <input 
        className={styles.inputContainer} type="text" id="email" 
        value={email} name="email" onChange={handleChange} 
        autoComplete="off" placeholder="Email" disabled={isSubmitted}
      />
      <button  className={styles.button} disabled={isFormInvalid() || isSubmitted}>
        Plus Icon
      </button>
    </form>
  );
}

export default ContractorForm;

// const createContractor = useMutation({
//   mutationFn: contractorService.create,
//   onSettled: () => {
//     queryClient.invalidateQueries(['contractors']);
//     setIsSubmitted(false);
//   },
// });