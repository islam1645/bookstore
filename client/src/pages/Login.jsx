import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, logout, reset } from '../redux/authSlice'; // Import logout !
import { toast } from 'react-toastify';
import { Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    // C'EST ICI LA SÉCURITÉ :
    if (isSuccess && user) {
      if (user.isAdmin) {
        // 1. Si c'est un Admin : Bienvenue !
        navigate('/admin/dashboard');
      } else {
        // 2. Si c'est un simple client qui essaie de se connecter ici : DEHORS !
        toast.error("Accès refusé : Réservé aux administrateurs");
        dispatch(logout()); // On le déconnecte force
        dispatch(reset());
      }
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-red-600" size={30} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Espace Administration</h2>
          <p className="text-sm text-gray-500 mt-2">Accès restreint au personnel autorisé</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <input
            type="email"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Email Admin"
            name="email"
            value={email}
            onChange={onChange}
          />
          <input
            type="password"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Mot de passe"
            name="password"
            value={password}
            onChange={onChange}
          />
          <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition">
            {isLoading ? 'Vérification...' : 'Accéder au Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;