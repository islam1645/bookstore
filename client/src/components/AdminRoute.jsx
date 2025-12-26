import React from 'react';
import { Navigate } from 'react-router-dom'; // J'ai enlevé 'useSelector' inutile ici si tu utilises children, mais garde-le si besoin
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  // 1. On ne récupère QUE 'user' du state
  const { user } = useSelector((state) => state.auth);

  // 2. On vérifie si user existe ET si user.isAdmin est vrai
  if (!user || !user.isAdmin) {
    // Si pas connecté ou pas admin, on renvoie à l'accueil
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;