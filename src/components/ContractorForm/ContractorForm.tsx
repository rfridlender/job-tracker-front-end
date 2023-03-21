import { useState } from 'react';
import styles from './ContractorForm.module.scss';
import * as contractorService from '../../services/contractorService';
import { ContractorFormData } from '../../types/forms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Contractor } from '../../types/models';
import { TiCancel, TiPlus } from 'react-icons/ti';

interface ContractorFormProps {
  setIsContractorFormOpen?: (boolean: boolean) => void;
  contractor?: Contractor;
  setIsBeingEdited?: (boolean: boolean) => void;
}

const ContractorForm = (props: ContractorFormProps): JSX.Element => {
  const { setIsContractorFormOpen, contractor, setIsBeingEdited } = props;

  const queryClient = useQueryClient();

  const createContractor = useMutation({
    mutationFn: () => contractorService.create(formData),
    onMutate: async (newContractor: ContractorFormData) => {
      await queryClient.cancelQueries(['contractors']);
      const previousContractors = queryClient.getQueryData<Contractor[]>(['contractors']);
      previousContractors && queryClient.setQueryData(
        ['contractors'], 
        [newContractor, ...previousContractors]
      );
      return previousContractors;
    },
    onError: (err, newContractor, context) => {
      queryClient.setQueryData(['contractors'], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contractors']);
    },
  });

  const updateContractor = useMutation({
    mutationFn: () => contractorService.update(formData.id, formData),
    onMutate: async (updatedContractor: ContractorFormData) => {
      await queryClient.cancelQueries(['contractors']);
      const previousContractors = queryClient.getQueryData<Contractor[]>(['contractors']);
      previousContractors && queryClient.setQueryData(
        ['contractors'], 
        previousContractors.map(contractor => 
          contractor.id !== updatedContractor.id ? contractor : updatedContractor
        )
      );
      return previousContractors;
    },
    onError: (err, updatedContractor, context) => {
      queryClient.setQueryData(['contractors'], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contractors']);
    },
  });

  const [formData, setFormData] = useState<ContractorFormData>({
    id: contractor ? contractor.id : 0,
    companyName: contractor ? contractor.companyName : '',
    contactName: contractor ? contractor.contactName : '',
    phoneNumber: contractor ? contractor.phoneNumber : '',
    email: contractor ? contractor.email : '',
  });

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    try {
      if (!contractor) {
        createContractor.mutate(formData);
        setIsContractorFormOpen && setIsContractorFormOpen(false);
      } else {
        updateContractor?.mutate(formData);
        setIsBeingEdited && setIsBeingEdited(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleCancelFunctions = () => {
    if (!contractor) {
      setIsContractorFormOpen && setIsContractorFormOpen(false);
    } else {
      setIsBeingEdited && setIsBeingEdited(false);
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
        autoComplete="off" placeholder="Company Name"
      />
      <input 
        className={styles.inputContainer} type="text" id="contactName" 
        value={contactName} name="contactName" onChange={handleChange} 
        autoComplete="off" placeholder="Contact Name"
      />
      <input 
        className={styles.inputContainer} type="tel" id="phoneNumber" 
        value={phoneNumber} name="phoneNumber" onChange={handleChange} 
        autoComplete="off" placeholder="000.000.0000"
        pattern="[0-9]{3}.[0-9]{3}.[0-9]{4}"
      />
      <input 
        className={styles.inputContainer} type="email" id="email" 
        value={email} name="email" onChange={handleChange} 
        autoComplete="off" placeholder="Email"
      />
      <div>
        <button disabled={isFormInvalid()} className={styles.button}>
          <TiPlus />
        </button>
        <TiCancel onClick={handleCancelFunctions} />
      </div>
    </form>
  );
}

export default ContractorForm;