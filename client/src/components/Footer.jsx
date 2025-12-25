import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Colonne 1 : La Marque */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">BookStore.</h2>
                    <p className="text-sm leading-relaxed">
                        Votre destination numéro un pour les livres tech, business et romans.
                        Nous livrons la connaissance directement chez vous.
                    </p>
                </div>

                {/* Colonne 2 : Liens Rapides */}
                <div>
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Liens Rapides</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-blue-400 transition">Accueil</Link></li>
                        <li><Link to="/about" className="hover:text-blue-400 transition">À Propos</Link></li>
                        {/*<li><Link to="/cart" className="hover:text-blue-400 transition" >Mon Panier</Link></li>*/}
                        {/* <li><Link to="/login" className="hover:text-blue-400 transition">Espace Admin</Link></li> */}
                    </ul>
                </div>

                {/* Colonne 3 : Contact */}
                <div>
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contactez-nous</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                            <MapPin size={18} className="text-blue-500" />
                            123 Rue de la Liberté, Alger
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={18} className="text-blue-500" />
                            +213 540 190 141
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={18} className="text-blue-500" />
                            kutubdz1@gmail.com
                        </li>
                    </ul>

                    {/* Réseaux Sociaux */}
                    <div className="flex gap-4 mt-6">

                        {/* FACEBOOK */}
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-500 transition cursor-pointer"
                        >
                            <Facebook size={20} />
                        </a>

                        {/* TWITTER / X */}
                        <a
                            href="https://twitter.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition cursor-pointer"
                        >
                            <Twitter size={20} />
                        </a>

                        {/* INSTAGRAM */}
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-pink-500 transition cursor-pointer"
                        >
                            <Instagram size={20} />
                        </a>

                    </div>
                </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-10 border-t border-gray-800 pt-6">
                &copy; {new Date().getFullYear()} KutubDz. Tous droits réservés.
            </div>
        </footer>
    );
};

export default Footer;