import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useSelector((state) => state.auth);

  if (!user || !isAdmin) {
    // Si pas connecté ou pas admin, on renvoie à l'accueil
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;