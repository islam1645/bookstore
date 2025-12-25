import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 9999999, // Z-INDEX MAXIMAL
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative animate-bounce-in">
        
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Félicitations ! 🎉
        </h2>

        <p className="text-gray-500 mb-8">
          Votre commande a été enregistrée avec succès.<br/>
          Notre équipe vous contactera très bientôt.
        </p>

        <button 
          onClick={onClose} 
          className="w-full bg-blue-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-800 transition flex items-center justify-center gap-2"
        >
          Continuer mes achats <ArrowRight size={20} />
        </button>

      </div>
    </div>
  );
};

export default SuccessModal;