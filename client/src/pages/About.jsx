import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">

        {/* Image d'en-tête */}
        <div className="h-64 w-full bg-blue-900 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">Notre Histoire</h1>
        </div>

        <div className="p-10 space-y-6 text-gray-700 leading-relaxed">
          <h2 className="text-3xl font-bold text-gray-800">Qui sommes-nous ?</h2>
          <p>
            À Propos de KutubDz : La lecture à portée de clic en Algérie
            Bienvenue chez KutubDz, votre nouvelle destination littéraire.

            Fondée en 2025, KutubDz est née d'un constat simple mais puissant : trouver le livre que l'on cherche en Algérie ne devrait pas être un parcours du combattant. Que vous soyez étudiant, passionné de romans, professionnel ou amateur de nouvelles technologies, nous avons créé cet espace pour vous.

            Ce que nous proposons KutubDz se distingue par une offre hybride et complète :

            Livres Neufs : Les dernières parutions mondiales et locales, livrées chez vous dans un état impeccable.

            Livres d'Occasion (Seconde main) : Parce qu'un livre a plusieurs vies, nous proposons une vaste sélection de livres d'occasion vérifiés, permettant de lire à petit prix tout en faisant un geste écologique.

            Le Coin Numérique : Nous sommes tournés vers l'avenir. Découvrez notre sélection de tablettes e-book (liseuses) pour emporter votre bibliothèque partout avec vous.
          </p>

          <p>
            Notre Mission Notre objectif est de révolutionner le marché du livre en Algérie. Nous croyons fermement que la lecture doit être accessible à tous, partout dans les 58 wilayas, et à tous les budgets. Nous ne vendons pas seulement des livres ; nous vendons de l'évasion, du savoir et de la culture.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8">Pourquoi nous choisir ?</h2>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Une sélection rigoureuse des meilleurs ouvrages.</li>
            <li>Une livraison rapide et fiable.</li>
            <li>Un service client passionné et à l'écoute.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;