import { useState } from 'react';
import styles from './ContractorForm.module.scss';
import * as contractorService from '../../services/contractorService';
import { ContractorFormData } from '../../types/forms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Contractor } from '../../types/models';
import { TiCancel, TiPlus } from 'react-icons/ti';
import { TbEraser } from 'react-icons/tb';
import Button from '../Button/Button';
import ButtonContainer from '../ButtonContainer/ButtonContainer';

interface ContractorFormProps {
  contractor?: Contractor;
  setIsBeingEdited?: (boolean: boolean) => void;
}

const ContractorForm = (props: ContractorFormProps): JSX.Element => {
  const { contractor, setIsBeingEdited } = props;

  const queryClient = useQueryClient();

  const createContractor = useMutation({
    mutationFn: () => contractorService.create(formData),
    onSettled: () => {
      queryClient.invalidateQueries(['contractors']);
      handleClear();
      setIsBeingSubmitted(false);
    },
  });

  const updateContractor = useMutation({
    mutationFn: (formData) => contractorService.update(formData.id, formData),
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
  const [isBeingSubmitted, setIsBeingSubmitted] = useState(false);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  }

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    if (isBeingSubmitted) return;
    try {
      if (!contractor) {
        setIsBeingSubmitted(true);
        createContractor.mutate();
      } else {
        setIsBeingEdited && setIsBeingEdited(false);
        updateContractor?.mutate(formData);
      }
    } catch (err) {
      console.log(err);
      setIsBeingSubmitted(false);
    }
  }

  const handleClear = () => setFormData({ 
    id: 0, companyName: '', contactName: '', phoneNumber: '', email: ''
  });

  const { companyName, contactName, phoneNumber, email } = formData;

  const isFormInvalid = (): boolean => {
    return !(companyName && contactName && phoneNumber && email);
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit} className={styles.container}>
      <input 
        type="text" value={companyName} name="companyName" 
        onChange={handleChange} autoComplete="off" placeholder="Company Name"
      />
      <input 
        type="text" value={contactName} name="contactName" 
        onChange={handleChange}  autoComplete="off" placeholder="Contact Name"
      />
      <input 
        type="tel" value={phoneNumber} name="phoneNumber" 
        onChange={handleChange}  autoComplete="off" placeholder="000.000.0000" 
        pattern="[0-9]{3}.[0-9]{3}.[0-9]{4}"
      />
      <input 
        type="email" value={email} name="email" 
        onChange={handleChange}  autoComplete="off" placeholder="Email"
      />
      <ButtonContainer>
        <Button 
          disabled={isFormInvalid() || isBeingSubmitted} 
          icon={!isBeingSubmitted && <TiPlus />} 
          content={!isBeingSubmitted ? 'Save' : 'Saving...'}
          accent 
        />
        {!contractor || !setIsBeingEdited ?
          <Button onClick={handleClear} icon={<TbEraser />} content="Clear" /> 
          :
          <Button onClick={() => setIsBeingEdited(false)} icon={<TiCancel />} content="Cancel" />
        }
      </ButtonContainer>
    </form>
  );
}

export default ContractorForm;