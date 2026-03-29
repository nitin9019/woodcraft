import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            nav_home: 'Home', nav_products: 'Products', nav_repair: 'Repair', nav_dashboard: 'Dashboard',
            hero_badge: 'Premium Furniture 2026',
            btn_getstarted: 'Get Started', btn_register: 'Create Account', btn_signin: 'Sign In',
            add_to_cart: 'Add to Cart', view_details: 'View Details',
            wishlist: 'Wishlist', cart: 'Cart', checkout: 'Checkout', notifications: 'Notifications',
        }
    },
    hi: {
        translation: {
            nav_home: 'होम', nav_products: 'उत्पाद', nav_repair: 'मरम्मत', nav_dashboard: 'डैशबोर्ड',
            hero_badge: 'प्रीमियम फर्नीचर 2026',
            btn_getstarted: 'शुरू करें', btn_register: 'खाता बनाएं', btn_signin: 'साइन इन',
            add_to_cart: 'कार्ट में जोड़ें', view_details: 'विवरण देखें',
            wishlist: 'विशलिस्ट', cart: 'कार्ट', checkout: 'चेकआउट', notifications: 'सूचनाएं',
        }
    },
    kn: {
        translation: {
            nav_home: 'ಮನೆ', nav_products: 'ಉತ್ಪನ್ನಗಳು', nav_repair: 'ದುರಸ್ತಿ', nav_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
            hero_badge: 'ಪ್ರೀಮಿಯಂ ಫರ್ನಿಚರ್ 2026',
            btn_getstarted: 'ಪ್ರಾರಂಭಿಸಿ', btn_register: 'ಖಾತೆ ರಚಿಸಿ', btn_signin: 'ಸೈನ್ ಇನ್',
            add_to_cart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ', view_details: 'ವಿವರಗಳು ನೋಡಿ',
            wishlist: 'ವಿಶ್‌ಲಿಸ್ಟ್', cart: 'ಕಾರ್ಟ್', checkout: 'ಚೆಕ್‌ಔಟ್', notifications: 'ಅಧಿಸೂಚನೆಗಳು',
        }
    },
    mr: {
        translation: {
            nav_home: 'मुख्यपृष्ठ', nav_products: 'उत्पादने', nav_repair: 'दुरुस्ती', nav_dashboard: 'डॅशबोर्ड',
            hero_badge: 'प्रीमियम फर्निचर 2026',
            btn_getstarted: 'सुरू करा', btn_register: 'खाते तयार करा', btn_signin: 'साइन इन',
            add_to_cart: 'कार्टमध्ये जोडा', view_details: 'तपशील पहा',
            wishlist: 'विशलिस्ट', cart: 'कार्ट', checkout: 'चेकआउट', notifications: 'सूचना',
        }
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
});

export default i18n;
