import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserCheck, UserX, ShieldAlert, Mail, Calendar, Unlock, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Récupération du token
  const { token } = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // 1. Récupérer les utilisateurs depuis le backend
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les utilisateurs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Bloquer / Activer un utilisateur
  const toggleUserStatus = async (id, currentStatus) => {
    if (window.confirm(`Voulez-vous vraiment ${currentStatus ? 'bloquer' : 'activer'} cet utilisateur ?`)) {
        try {
            await axios.put(`/api/users/${id}/status`, {}, config);
            toast.success(`Utilisateur ${currentStatus ? 'bloqué' : 'activé'} avec succès`);
            fetchUsers(); // Rafraichir la liste
        } catch (error) {
            toast.error("Erreur lors de la modification du statut");
        }
    }
  };

  // 3. Filtrage pour la recherche
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. Calculs stats rapides
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isVerified).length;
  const blockedUsers = totalUsers - activeUsers;

  return (
    <div className="space-y-6">
      
      {/* --- CARTES STATISTIQUES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><UserCheck size={20}/> Total Inscrits</div>
            <div className="text-3xl font-bold text-blue-900">{totalUsers}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><ShieldAlert size={20}/> Comptes Vérifiés</div>
            <div className="text-3xl font-bold text-green-600">{activeUsers}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><UserX size={20}/> Non Vérifiés / Bloqués</div>
            <div className="text-3xl font-bold text-red-600">{blockedUsers}</div>
        </div>
      </div>

      {/* --- LISTE UTILISATEURS --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800">Gestion des Comptes</h2>
            
            {/* Barre de Recherche */}
            <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Rechercher par nom ou email..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {loading ? (
            <div className="text-center py-10 text-gray-500">Chargement...</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-gray-600 text-sm uppercase">
                            <th className="p-4">Utilisateur</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Date Inscription</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center text-gray-500">Aucun utilisateur trouvé.</td></tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-blue-50 transition">
                                    <td className="p-4 font-medium text-gray-900 capitalize">
                                        {user.name} 
                                        {user.isAdmin && <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full border border-purple-200">Admin</span>}
                                    </td>
                                    <td className="p-4 text-gray-600 flex items-center gap-2">
                                        <Mail size={14} className="text-gray-400"/> {user.email}
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar size={14}/> 
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {user.isVerified ? (
                                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                                                Actif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                                                Bloqué
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        {/* Empêcher de se bloquer soi-même */}
                                        {!user.isAdmin && (
                                            <button 
                                                onClick={() => toggleUserStatus(user._id, user.isVerified)}
                                                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 ml-auto transition ${
                                                    user.isVerified 
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                                }`}
                                            >
                                                {user.isVerified ? <Lock size={14}/> : <Unlock size={14}/>}
                                                {user.isVerified ? 'Bloquer' : 'Activer'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;