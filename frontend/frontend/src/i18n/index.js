import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: {
    nav_home:'Home', nav_products:'Products', nav_repair:'Repair', nav_dashboard:'Dashboard',
    hero_badge:'Premium Furniture 2026', hero_title1:'Elevate Your', hero_title2:'Living Space',
    hero_title3:'with Luxury', hero_sub:'Discover premium handcrafted furniture.',
    btn_getstarted:'Get Started', btn_register:'Create Account', btn_signin:'Sign In',
    search_placeholder:'Search furniture...', all_categories:'All Categories',
    add_to_cart:'Add to Cart', view_details:'View Details', book_now:'Book Now',
    ai_title:'AI Furniture Assistant', ai_placeholder:'Ask me anything about furniture...',
    voice_hint:'Click mic and speak', lang_label:'Language',
    wishlist:'Wishlist', cart:'Cart', checkout:'Checkout',
    track_order:'Track Order', notifications:'Notifications',
  }},
  hi: { translation: {
    nav_home:'होम', nav_products:'उत्पाद', nav_repair:'मरम्मत', nav_dashboard:'डैशबोर्ड',
    hero_badge:'प्रीमियम फर्नीचर 2026', hero_title1:'अपना', hero_title2:'घर सजाएं',
    hero_title3:'लक्जरी के साथ', hero_sub:'प्रीमियम हस्तनिर्मित फर्नीचर खोजें।',
    btn_getstarted:'शुरू करें', btn_register:'खाता बनाएं', btn_signin:'साइन इन',
    search_placeholder:'फर्नीचर खोजें...', all_categories:'सभी श्रेणियां',
    add_to_cart:'कार्ट में जोड़ें', view_details:'विवरण देखें', book_now:'अभी बुक करें',
    ai_title:'AI फर्नीचर सहायक', ai_placeholder:'फर्नीचर के बारे में पूछें...',
    voice_hint:'माइक दबाएं और बोलें', lang_label:'भाषा',
    wishlist:'विशलिस्ट', cart:'कार्ट', checkout:'चेकआउट',
    track_order:'ऑर्डर ट्रैक करें', notifications:'सूचनाएं',
  }},
  kn: { translation: {
    nav_home:'ಮನೆ', nav_products:'ಉತ್ಪನ್ನಗಳು', nav_repair:'ದುರಸ್ತಿ', nav_dashboard:'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    hero_badge:'ಪ್ರೀಮಿಯಂ ಫರ್ನಿಚರ್ 2026', hero_title1:'ನಿಮ್ಮ', hero_title2:'ಮನೆ ಅಲಂಕರಿಸಿ',
    hero_title3:'ಐಷಾರಾಮಿಯೊಂದಿಗೆ', hero_sub:'ಪ್ರೀಮಿಯಂ ಕರಕುಶಲ ಫರ್ನಿಚರ್ ಅನ್ವೇಷಿಸಿ.',
    btn_getstarted:'ಪ್ರಾರಂಭಿಸಿ', btn_register:'ಖಾತೆ ರಚಿಸಿ', btn_signin:'ಸೈನ್ ಇನ್',
    search_placeholder:'ಫರ್ನಿಚರ್ ಹುಡುಕಿ...', all_categories:'ಎಲ್ಲಾ ವರ್ಗಗಳು',
    add_to_cart:'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ', view_details:'ವಿವರಗಳು ನೋಡಿ', book_now:'ಈಗ ಬುಕ್ ಮಾಡಿ',
    ai_title:'AI ಫರ್ನಿಚರ್ ಸಹಾಯಕ', ai_placeholder:'ಫರ್ನಿಚರ್ ಬಗ್ಗೆ ಕೇಳಿ...',
    voice_hint:'ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ', lang_label:'ಭಾಷೆ',
    wishlist:'ವಿಶ್‌ಲಿಸ್ಟ್', cart:'ಕಾರ್ಟ್', checkout:'ಚೆಕ್‌ಔಟ್',
    track_order:'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ', notifications:'ಅಧಿಸೂಚನೆಗಳು',
  }},
  mr: { translation: {
    nav_home:'मुख्यपृष्ठ', nav_products:'उत्पादने', nav_repair:'दुरुस्ती', nav_dashboard:'डॅशबोर्ड',
    hero_badge:'प्रीमियम फर्निचर 2026', hero_title1:'तुमचे', hero_title2:'घर सजवा',
    hero_title3:'लक्झरीसह', hero_sub:'प्रीमियम हस्तनिर्मित फर्निचर शोधा.',
    btn_getstarted:'सुरू करा', btn_register:'खाते तयार करा', btn_signin:'साइन इन',
    search_placeholder:'फर्निचर शोधा...', all_categories:'सर्व श्रेणी',
    add_to_cart:'कार्टमध्ये जोडा', view_details:'तपशील पहा', book_now:'आता बुक करा',
    ai_title:'AI फर्निचर सहाय्यक', ai_placeholder:'फर्निचरबद्दल विचारा...',
    voice_hint:'मायक्रोफोन दाबा आणि बोला', lang_label:'भाषा',
    wishlist:'विशलिस्ट', cart:'कार्ट', checkout:'चेकआउट',
    track_order:'ऑर्डर ट्रॅक करा', notifications:'सूचना',
  }},
};

i18n.use(initReactI18next).init({
  resources, lng: 'en', fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
