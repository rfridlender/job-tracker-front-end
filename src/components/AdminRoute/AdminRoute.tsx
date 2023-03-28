import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Role } from '../../types/enums';
import { User } from '../../types/models';

interface AdminRouteProps {
  user: User | null;
  children: ReactNode;
}

const AdminRoute = (props: AdminRouteProps): JSX.Element => {
  const { user, children } = props;

  if (!user) {
    return (<Navigate to="/" />);
  } else if (user.role !== Role.ADMIN) {
    return (<Navigate to="/portal/jobs" />);
  } else {
    return (<>{ children }</>);
  }
}

export default AdminRoute;