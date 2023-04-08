import { Contractor } from '../../../types/models';
import TableCell from '../../UI/TableCell/TableCell';
import styles from './ContractorDetails.module.scss';

interface ContractorDetailsProps {
  contractor: Contractor;
}

const ContractorDetails = (props: ContractorDetailsProps) => {
  const { contractor } = props;

  return (
    <div className={styles.container}>
      <TableCell content={contractor.companyName} />
      <TableCell content={contractor.contactName} />
      <a href={`tel:+${contractor.phoneNumber.replaceAll('.', '')}`}>{contractor.phoneNumber}</a>
      <a href={`mailto:${contractor.email}`}>{contractor.email}</a>
    </div>
  );
}
 
export default ContractorDetails;