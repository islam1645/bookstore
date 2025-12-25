import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  // Remplace ce numéro par le tien (ex: 213550...) sans le +
  const phoneNumber = "213540190141"; 
  const message = "Salam, je suis intéressé par un livre sur KutubDZ.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center animate-bounce-slow"
      title="Discuter sur WhatsApp"
    >
      <MessageCircle size={32} fill="white" className="text-green-500" />
      {/* Petit point rouge de notification pour attirer l'œil */}
      <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500"></span>
    </a>
  );
};

export default WhatsAppButton;