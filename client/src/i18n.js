import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      "navbar": {
        "home": "Accueil",
        "shop": "Boutique",
        "categories": "Catégories",
        "about": "À Propos",
        "login": "Connexion",
        "cart": "Panier",
        "dashboard": "Dashboard",
        "logout": "Déconnexion"
      },
      "hero": {
        "title": "Bienvenue chez KutubDZ",
        "subtitle": "Découvrez les meilleurs livres du moment, livrés directement chez vous en Algérie.",
        "button": "Voir tout le catalogue"
      },
      "home": {
        "latest_arrivals": "Derniers Arrivages",
        "librarian_selection": "La Sélection du Libraire",
        "view_more": "Voir plus",
        "view_all_btn": "Voir tous les livres",
        "loading": "Chargement...",
        "error": "Erreur de chargement"
      },
      "footer": {
        "desc": "Votre destination numéro 1 pour les livres en Algérie.",
        "quick_links": "Liens Rapides",
        "contact": "Contactez-nous",
        "rights": "Tous droits réservés.",
        "address": "Alger, Algérie",
        "phone": "Téléphone"
      },
      // --- CETTE SECTION MANQUAIT ---
      "categories": {
        "books_count": "{{count}} livre",
        "books_count_plural": "{{count}} livres"
      },
      // ------------------------------
      "category_page": {
        "back_home": "Retour à l'accueil",
        "category_label": "Catégorie :",
        "no_books": "Aucun livre trouvé dans cette catégorie pour le moment.",
        "loading": "Chargement..."
      },
      "shop": {
        "title": "Notre Catalogue",
        "search_placeholder": "Rechercher un livre, un auteur...",
        "all_categories": "Tout",
        "no_books": "Aucun livre trouvé.",
        "reset_filters": "Réinitialiser les filtres",
        "error": "Erreur"
      },
      "all_categories_page": {
        "title": "Explorez par Catégorie",
        "subtitle": "Trouvez exactement ce que vous cherchez.",
        "all_books_title": "Tous les Livres",
        "all_books_desc": "Toute notre collection sans filtre.",
        "browse_collection": "Parcourir la collection {{name}}",
        "loading": "Chargement..."
      },
      "login_page": {
  "title": "Connexion Client",
  "no_account": "Pas encore de compte ?",
  "register_link": "Créez un compte ici",
  "email": "Adresse Email",
  "password": "Mot de passe",
  "submit": "Se connecter"
},
"register_page": {
  "title": "Créer un compte",
  "name": "Nom complet",
  "email": "Email",
  "password": "Mot de passe",
  "submit": "S'inscrire",
  "already_have_account": "Déjà inscrit ?"
},
"orders": {
  "title": "Mes Commandes",
  "no_orders": "Vous n'avez pas encore passé de commande.",
  "order_id": "Commande N°",
  "date": "Date",
  "status": "Statut",
  "total": "Total",
  "status_pending": "En attente",
  "status_shipped": "En cours de livraison",
  "status_delivered": "Livré"
},
"about": {
  "title": "À Propos de Nous",
  "subtitle": "Votre passerelle vers la connaissance en Algérie.",
  "story_title": "Notre Histoire",
  "story_text": "Fondée en 2025, KutubDZ est née d'une passion simple : rendre la lecture accessible à tous les Algériens. Nous avons commencé avec une petite sélection de livres et une grande vision. Aujourd'hui, nous sommes fiers d'offrir une vaste bibliothèque de livres neufs, d'occasion et de liseuses numériques.",
  "mission_title": "Notre Mission",
  "mission_text": "Notre mission est d'encourager la culture de la lecture en Algérie en proposant des prix abordables et une livraison rapide vers les 58 wilayas. Nous croyons que chaque livre ouvert est un nouvel horizon découvert.",
  "values": {
    "quality": "Qualité Garantie",
    "delivery": "Livraison 58 Wilayas",
    "community": "Communauté Passionnée",
    "support": "Service Client 7/7"
  }
}
    }
  },
  ar: {
    translation: {
      "navbar": {
        "home": "الرئيسية",
        "shop": "المتجر",
        "categories": "التصنيفات",
        "about": "من نحن",
        "login": "دخول",
        "cart": "السلة",
        "dashboard": "لوحة التحكم",
        "logout": "خروج"
      },
      "hero": {
        "title": "مرحبًا بكم في KutubDZ",
        "subtitle": "اكتشف أفضل الكتب الحالية، مع توصيل مباشر إلى باب منزلك في الجزائر.",
        "button": "تصفح المكتبة"
      },
      "home": {
        "latest_arrivals": "أحدث الكتب",
        "librarian_selection": "اختيارات المكتبة",
        "view_more": "عرض المزيد",
        "view_all_btn": "تصفح كل الكتب",
        "loading": "جاري التحميل...",
        "error": "خطأ في التحميل"
      },
      "footer": {
        "desc": "وجهتك الأولى للكتب في الجزائر. نسهل عليك القراءة.",
        "quick_links": "روابط سريعة",
        "contact": "تواصل معنا",
        "rights": "جميع الحقوق محفوظة.",
        "address": "الجزائر العاصمة، الجزائر",
        "phone": "هاتف"
      },
      // --- CETTE SECTION MANQUAIT ---
      "categories": {
        "books_count": "{{count}} كتاب",
        "books_count_plural": "{{count}} كتب"
      },
      // ------------------------------
      "category_page": {
        "back_home": "العودة إلى الرئيسية",
        "category_label": "التصنيف:",
        "no_books": "لم يتم العثور على كتب في هذا التصنيف حاليًا.",
        "loading": "جاري التحميل..."
      },
      "shop": {
        "title": "كتالوجنا",
        "search_placeholder": "ابحث عن كتاب، مؤلف...",
        "all_categories": "الكل",
        "no_books": "لم يتم العثور على كتب.",
        "reset_filters": "إعادة ضبط الفلاتر",
        "error": "خطأ"
      },
      "all_categories_page": {
        "title": "تصفح حسب التصنيف",
        "subtitle": "جد بالضبط ما تبحث عنه.",
        "all_books_title": "كل الكتب",
        "all_books_desc": "مجموعتنا كاملة بدون فلاتر.",
        "browse_collection": "تصفح مجموعة {{name}}",
        "loading": "جاري التحميل..."
      },
      "login_page": {
  "title": "تسجيل دخول الزبون",
  "no_account": "ليس لديك حساب؟",
  "register_link": "أنشئ حسابًا هنا",
  "email": "البريد الإلكتروني",
  "password": "كلمة المرور",
  "submit": "تسجيل الدخول"
},
"register_page": {
  "title": "إنشاء حساب جديد",
  "name": "الاسم الكامل",
  "email": "البريد الإلكتروني",
  "password": "كلمة المرور",
  "submit": "إنشاء الحساب",
  "already_have_account": "لديك حساب بالفعل؟"
},
"orders": {
  "title": "طلباتي",
  "no_orders": "لم تقم بأي طلبية بعد.",
  "order_id": "رقم الطلبية",
  "date": "التاريخ",
  "status": "الحالة",
  "total": "المجموع",
  "status_pending": "قيد الانتظار",
  "status_shipped": "جاري التوصيل",
  "status_delivered": "تم التسليم"
},
"about": {
  "title": "من نحن",
  "subtitle": "بوابتك نحو المعرفة في الجزائر.",
  "story_title": "قصتنا",
  "story_text": "تأسست KutubDZ في عام 2025 بدافع شغف بسيط: جعل القراءة في متناول جميع الجزائريين. بدأنا بمجموعة صغيرة من الكتب ورؤية كبيرة. اليوم، نحن فخورون بتقديم مكتبة واسعة من الكتب الجديدة والمستعملة والقارئات الإلكترونية.",
  "mission_title": "مهمتنا",
  "mission_text": "مهمتنا هي تشجيع ثقافة القراءة في الجزائر من خلال توفير أسعار معقولة وخدمة توصيل سريعة لجميع الولايات الـ 58. نحن نؤمن بأن كل كتاب يُفتح هو أفق جديد يُكتشف.",
  "values": {
    "quality": "جودة مضمونة",
    "delivery": "توصيل 58 ولاية",
    "community": "مجتمع شغوف",
    "support": "دعم فني 7/7"
  }
}
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fr", 
    fallbackLng: "fr", // Ajout d'une langue de secours
    interpolation: { escapeValue: false }
  });

export default i18n;