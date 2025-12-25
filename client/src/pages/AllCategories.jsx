import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCategories } from '../redux/categorySlice';
import { Library, Hash, ArrowRight, Image as ImageIcon } from 'lucide-react';

const AllCategories = () => {
  const dispatch = useDispatch();
  const { categories: dbCategories, isLoading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Option statique "Tous les livres" (On garde celle-ci car elle est pratique)
  const allBooksOption = {
    name: 'Tous les Livres',
    path: '/shop',
    icon: <Library size={40} />,
    color: 'bg-gray-900 text-white',
    desc: 'Toute notre collection sans filtre.'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explorez par Catégorie</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Trouvez exactement ce que vous cherchez.
          </p>
        </div>
        
        {isLoading ? (
             <p className="text-center text-gray-500">Chargement...</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* 1. Carte "Tous les livres" (Statique) */}
            <Link 
                to={allBooksOption.path} 
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-center text-center group h-full"
            >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm ${allBooksOption.color} group-hover:scale-110 transition-transform duration-300`}>
                    {allBooksOption.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {allBooksOption.name}
                </h2>
                <p className="text-gray-500 text-xs leading-relaxed">{allBooksOption.desc}</p>
            </Link>

            {/* 2. Cartes Dynamiques (Images depuis la BDD) */}
            {dbCategories.map((cat) => {
                return (
                  <Link 
                    key={cat._id} 
                    to={`/category/${cat.name}`} 
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-center text-center group h-full"
                  >
                    {/* CERCLE IMAGE */}
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm bg-gray-50 overflow-hidden group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                        {cat.image ? (
                            // CAS A : Il y a une image dans la base de données
                            <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            // CAS B : Pas d'image, on affiche une icône par défaut
                            <Hash size={32} className="text-gray-400" />
                        )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {cat.name}
                    </h2>
                    
                    {/* Description générique (car la BDD n'a pas de description pour l'instant) */}
                    <p className="text-gray-500 text-xs leading-relaxed">
                        Parcourir la collection {cat.name}
                    </p>

                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                        <ArrowRight size={20} />
                    </div>
                  </Link>
                );
            })}
            </div>
        )}

      </div>
    </div>
  );
};

export default AllCategories;