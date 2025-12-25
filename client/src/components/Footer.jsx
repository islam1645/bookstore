import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 1. Import du hook

const Footer = () => {
    const { t } = useTranslation(); // 2. Initialisation

    return (
        <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Colonne 1 : La Marque */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">KutubDz.</h2>
                    <p className="text-sm leading-relaxed">
                        {t('footer.desc')}
                    </p>
                </div>

                {/* Colonne 2 : Liens Rapides */}
                <div>
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
                        {t('footer.quick_links')}
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-blue-400 transition">{t('navbar.home')}</Link></li>
                        <li><Link to="/about" className="hover:text-blue-400 transition">{t('navbar.about')}</Link></li>
                    </ul>
                </div>

                {/* Colonne 3 : Contact */}
                <div>
                    <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
                        {t('footer.contact')}
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                            <MapPin size={18} className="text-blue-500 shrink-0" />
                            <span>{t('footer.address')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={18} className="text-blue-500 shrink-0" />
                            <span dir="ltr" className="inline-block text-left">
                                +213 540 190 141
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={18} className="text-blue-500 shrink-0" />
                            <span dir="ltr" className="inline-block text-left">
                                kutubdz1@gmail.com
                            </span>
                        </li>
                    </ul>

                    {/* Réseaux Sociaux */}
                    <div className="flex gap-4 mt-6">
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-500 transition cursor-pointer"
                        >
                            <Facebook size={20} />
                        </a>
                        <a
                            href="https://twitter.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition cursor-pointer"
                        >
                            <Twitter size={20} />
                        </a>
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
                &copy; {new Date().getFullYear()} KutubDz. {t('footer.rights')}
            </div>
        </footer>
    );
};

export default Footer;