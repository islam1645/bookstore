import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios'; // We use axios directly for the OTP step
import { setCredentials } from '../redux/authSlice'; // To log in manually after OTP

const UserRegister = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1); // 1 = Register Form, 2 = OTP Verification
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STEP 1: SEND REGISTRATION DATA ---
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password) {
      return toast.error(t('register_page.fill_all_fields') || 'Veuillez remplir tous les champs');
    }
    if (password.length < 8) {
      return toast.error(isArabic 
        ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" 
        : "Le mot de passe doit contenir au moins 8 caractères");
    }

    try {
      setLoading(true);
      // Backend URL detection
      const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://bookstore-d1k4.onrender.com';

      // Send data to backend (will trigger email sending)
      await axios.post(`${API_URL}/api/users`, formData);
      
      setLoading(false);
      setStep(2); // Move to OTP step
      toast.success(isArabic ? "تم إرسال الرمز! تحقق من بريدك الإلكتروني." : "Code envoyé ! Vérifiez votre email.");

    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || "Erreur d'inscription";
      toast.error(msg);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://bookstore-d1k4.onrender.com';

      // Verify OTP
      const res = await axios.post(`${API_URL}/api/users/verify-email`, {
        email,
        otp
      });

      // If success, log the user in
      dispatch(setCredentials(res.data));
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      
      setLoading(false);
      toast.success(isArabic ? "تم تفعيل الحساب بنجاح!" : "Compte vérifié ! Bienvenue.");
      navigate('/'); // Redirect to home

    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || "Code incorrect";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-900">
            {step === 1 ? t('register_page.title') : (isArabic ? 'تفعيل الحساب' : 'Vérification Email')}
          </h2>
          {step === 2 && (
            <p className="text-gray-500 text-sm mt-2">
              {isArabic ? `أرسلنا رمزًا إلى ${email}` : `Code envoyé à ${email}`}
            </p>
          )}
        </div>

        {step === 1 ? (
          /* --- FORMULAIRE INSCRIPTION (STEP 1) --- */
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('register_page.name')}</label>
              <div className="relative">
                <User className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />
                <input 
                  name="name" type="text" 
                  className={`w-full ${isArabic ? 'pr-10 text-right' : 'pl-10'} py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="Ex: Mohamed Amine"
                  value={name} onChange={onChange} required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('register_page.email')}</label>
              <div className="relative">
                <Mail className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />
                <input 
                  name="email" type="email" 
                  className={`w-full ${isArabic ? 'pr-10 text-right' : 'pl-10'} py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="votre@email.com"
                  value={email} onChange={onChange} required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('register_page.password')}</label>
              <div className="relative">
                <Lock className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-gray-400`} size={20} />
                <input 
                  name="password" type="password" 
                  className={`w-full ${isArabic ? 'pr-10 text-right' : 'pl-10'} py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="********"
                  value={password} onChange={onChange} required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isArabic ? 'يجب أن يحتوي على 8 أحرف على الأقل' : 'Doit contenir au moins 8 caractères'}
              </p>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? '...' : t('register_page.submit')}
              {isArabic ? <ArrowLeft size={20}/> : <ArrowRight size={20}/>}
            </button>
          </form>
        ) : (
          /* --- FORMULAIRE OTP (STEP 2) --- */
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                 {isArabic ? 'أدخل الرمز المكون من 6 أرقام' : 'Entrez le code à 6 chiffres'}
               </label>
               <input 
                 type="text" 
                 className="w-full text-center text-3xl tracking-[0.5em] py-3 border-2 border-blue-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-mono text-blue-900 font-bold"
                 placeholder="------"
                 maxLength="6"
                 value={otp}
                 onChange={(e) => setOtp(e.target.value)}
                 required
                 autoFocus
               />
            </div>
            
            <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
              {loading ? (isArabic ? 'جاري التحقق...' : 'Vérification...') : (isArabic ? 'تأكيد الحساب' : 'Confirmer')} 
              <CheckCircle size={20} />
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="w-full text-sm text-gray-500 hover:text-blue-600 underline"
            >
              {isArabic ? 'رجوع (تغيير البريد الإلكتروني)' : 'Retour (Corriger l\'email)'}
            </button>
          </form>
        )}

        {/* Footer Link (Login) */}
        {step === 1 && (
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              {t('register_page.already_have_account')} 
              <Link to="/user-login" className="text-blue-600 font-bold hover:underline ml-1">
                  {t('login_page.submit')}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRegister;