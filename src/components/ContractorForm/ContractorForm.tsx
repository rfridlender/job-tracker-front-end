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
import { isValid, z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../Input/Input';
import ErrorContainer from '../ErrorContainer/ErrorContainer';
import MessageOverlay from '../MessageOverlay/MessageOverlay';

interface ContractorFormProps {
  contractor?: Contractor;
  setIsBeingEdited?: (boolean: boolean) => void;
}

const ContractorForm = (props: ContractorFormProps): JSX.Element => {
  const { contractor, setIsBeingEdited } = props;

  const queryClient = useQueryClient();

  const createContractor = useMutation({
    mutationFn: (data: ContractorFormData) => contractorService.create(data),
    onError: () => {
      setMessage('Error creating builder');
    },
    onSuccess: () => {
      setMessage('Successfully created builder');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contractors']);
      handleClear();
    },
  });

  const updateContractor = useMutation({
    mutationFn: (data: ContractorFormData) => contractorService.update(data.id, data),
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

  const [message, setMessage] = useState<string>('');

  const formSchema = z.object({
    id: z.number(),
    companyName: z.string().min(1, "Company name is required"),
    contactName: z.string().min(1, "Contact name is required"),
    phoneNumber: z.string().regex(new RegExp('[0-9]{3}.[0-9]{3}.[0-9]{4}'), "Invalid format: 000.000.0000"),
    email: z.string().min(1, "Email is required").email("Email is invalid"),
  });

  const { 
    register, reset, handleSubmit, control, formState: { errors, isSubmitted, isDirty, isSubmitting }
  } = useForm<ContractorFormData>({
    defaultValues: {
      id: contractor ? contractor.id : 0,
      companyName: contractor ? contractor.companyName : '',
      contactName: contractor ? contractor.contactName : '',
      phoneNumber: contractor ? contractor.phoneNumber : '',
      email: contractor ? contractor.email : '',
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<ContractorFormData> = async data => {
    try {
      if (!contractor) {
        createContractor.mutate(data);
      } else {
        setIsBeingEdited && setIsBeingEdited(false);
        updateContractor.mutate(data);
      }
    } catch (err: any) {
      setMessage(err.message)
      console.log(err);
    }
  }

  const handleClear = () => reset();

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      {errors.companyName?.message && <ErrorContainer content={errors.companyName.message} />}
      <Input name="companyName" register={register} placeholder="Company Name" />
      {errors.contactName?.message && <ErrorContainer content={errors.contactName.message} />}
      <Input name="contactName" register={register} placeholder="Contact Name" />
      {errors.phoneNumber?.message && <ErrorContainer content={errors.phoneNumber.message} />}
      <Input name="phoneNumber" register={register} placeholder="000.000.0000" />
      {errors.email?.message && <ErrorContainer content={errors.email.message} />}
      <Input name="email" register={register} placeholder="Email" />
      <ButtonContainer>
        <Button 
          disabled={!isDirty || isSubmitted} 
          icon={(!isSubmitted || isSubmitted) && <TiPlus />} 
          content={(!isSubmitted || isSubmitted) ? 'Save' : 'Saving...'}
          accent 
        />
        {!contractor || !setIsBeingEdited ?
          <Button onClick={handleClear} icon={<TbEraser />} content="Clear" /> 
          :
          <Button onClick={() => setIsBeingEdited(false)} icon={<TiCancel />} content="Cancel" />
        }
      </ButtonContainer>
      {message && <MessageOverlay setMessage={setMessage} content={message} />}
    </form>
  );
}

export default ContractorForm;