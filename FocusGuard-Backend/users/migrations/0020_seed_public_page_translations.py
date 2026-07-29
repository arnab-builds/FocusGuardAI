from django.db import migrations


PUBLIC_TRANSLATIONS = {
    "en": {
        "login": "Login",
        "register": "Register",
        "username": "Username",
        "email": "Email",
        "password": "Password",
        "confirm_password": "Confirm Password",
        "preferred_language": "Preferred Language",
        "submit": "Submit",
        "invitation_code": "Invitation Code",
        "organization_name": "Organization Name",
        "select_language": "Select language",
        "welcome_back": "Welcome Back",
        "login_subtitle": "Sign in to continue to FocusGuard",
        "organization_admin": "Organization Admin",
        "organization_admin_login_subtitle": "Login to FocusGuard AI",
        "super_admin_login": "Super Admin Login",
        "employee_registration": "Employee Registration",
        "employee_registration_subtitle": "Create your FocusGuardAI account",
        "organization_admin_registration": "Organization Admin Registration",
        "organization_admin_registration_subtitle": "Create your administrator account",
        "create_account": "Create Account",
        "creating_account": "Creating Account...",
        "logging_in": "Logging in...",
        "signing_in": "Signing In...",
        "secure_authentication": "Secure authentication powered by JWT",
        "productivity_tagline": "Monitor productivity, track activity, analyze reports, and improve focus with one powerful dashboard.",
        "real_time_activity_tracking": "Real-time Activity Tracking",
        "ai_productivity_insights": "AI Productivity Insights",
        "daily_analytics_reports": "Daily Analytics & Reports",
        "already_have_account": "Already have an account?",
        "forgot_password": "Forgot Password?",
    },
    "hi": {
        "login": "लॉगिन",
        "register": "रजिस्टर",
        "username": "उपयोगकर्ता नाम",
        "email": "ईमेल",
        "password": "पासवर्ड",
        "confirm_password": "पासवर्ड की पुष्टि करें",
        "preferred_language": "पसंदीदा भाषा",
        "submit": "सबमिट करें",
        "invitation_code": "निमंत्रण कोड",
        "organization_name": "संगठन का नाम",
        "select_language": "भाषा चुनें",
        "welcome_back": "वापस स्वागत है",
        "login_subtitle": "FocusGuard जारी रखने के लिए साइन इन करें",
        "organization_admin": "संगठन प्रशासक",
        "organization_admin_login_subtitle": "FocusGuard AI में लॉगिन करें",
        "super_admin_login": "सुपर एडमिन लॉगिन",
        "employee_registration": "कर्मचारी पंजीकरण",
        "employee_registration_subtitle": "अपना FocusGuardAI खाता बनाएं",
        "organization_admin_registration": "संगठन प्रशासक पंजीकरण",
        "organization_admin_registration_subtitle": "अपना प्रशासक खाता बनाएं",
        "create_account": "खाता बनाएं",
        "creating_account": "खाता बनाया जा रहा है...",
        "logging_in": "लॉगिन हो रहा है...",
        "signing_in": "साइन इन हो रहा है...",
        "secure_authentication": "JWT द्वारा सुरक्षित प्रमाणीकरण",
        "productivity_tagline": "एक शक्तिशाली डैशबोर्ड से उत्पादकता देखें, गतिविधि ट्रैक करें, रिपोर्ट का विश्लेषण करें और फोकस बेहतर करें.",
        "real_time_activity_tracking": "रीयल-टाइम गतिविधि ट्रैकिंग",
        "ai_productivity_insights": "AI उत्पादकता इनसाइट्स",
        "daily_analytics_reports": "दैनिक एनालिटिक्स और रिपोर्ट",
        "already_have_account": "पहले से खाता है?",
        "forgot_password": "पासवर्ड भूल गए?",
    },
    "ta": {
        "login": "உள்நுழை",
        "register": "பதிவு",
        "username": "பயனர் பெயர்",
        "email": "மின்னஞ்சல்",
        "password": "கடவுச்சொல்",
        "confirm_password": "கடவுச்சொல்லை உறுதிப்படுத்து",
        "preferred_language": "விருப்ப மொழி",
        "submit": "சமர்ப்பி",
        "invitation_code": "அழைப்புக் குறியீடு",
        "organization_name": "நிறுவனத்தின் பெயர்",
        "select_language": "மொழியைத் தேர்ந்தெடு",
        "welcome_back": "மீண்டும் வரவேற்கிறோம்",
        "login_subtitle": "FocusGuard தொடர உள்நுழையவும்",
        "organization_admin": "நிறுவன நிர்வாகி",
        "organization_admin_login_subtitle": "FocusGuard AI-க்கு உள்நுழையவும்",
        "super_admin_login": "சூப்பர் நிர்வாகி உள்நுழைவு",
        "employee_registration": "பணியாளர் பதிவு",
        "employee_registration_subtitle": "உங்கள் FocusGuardAI கணக்கை உருவாக்கவும்",
        "organization_admin_registration": "நிறுவன நிர்வாகி பதிவு",
        "organization_admin_registration_subtitle": "உங்கள் நிர்வாகி கணக்கை உருவாக்கவும்",
        "create_account": "கணக்கை உருவாக்கு",
        "creating_account": "கணக்கு உருவாக்கப்படுகிறது...",
        "logging_in": "உள்நுழைகிறது...",
        "signing_in": "உள்நுழைகிறது...",
        "secure_authentication": "JWT மூலம் பாதுகாப்பான அங்கீகாரம்",
        "productivity_tagline": "ஒரே சக்திவாய்ந்த டாஷ்போர்டில் உற்பத்தித் திறனை கண்காணித்து, செயல்பாட்டைத் தொடர்ந்து, அறிக்கைகளை பகுப்பாய்வு செய்து கவனத்தை மேம்படுத்துங்கள்.",
        "real_time_activity_tracking": "நேரடி செயல்பாட்டு கண்காணிப்பு",
        "ai_productivity_insights": "AI உற்பத்தித் திறன் நுண்ணறிவுகள்",
        "daily_analytics_reports": "தினசரி பகுப்பாய்வு மற்றும் அறிக்கைகள்",
        "already_have_account": "ஏற்கனவே கணக்கு உள்ளதா?",
        "forgot_password": "கடவுச்சொல் மறந்துவிட்டதா?",
    },
    "te": {
        "login": "లాగిన్",
        "register": "నమోదు",
        "username": "వినియోగదారు పేరు",
        "email": "ఇమెయిల్",
        "password": "పాస్వర్డ్",
        "confirm_password": "పాస్వర్డ్ నిర్ధారించండి",
        "preferred_language": "ప్రాధాన్య భాష",
        "submit": "సమర్పించండి",
        "invitation_code": "ఆహ్వాన కోడ్",
        "organization_name": "సంస్థ పేరు",
        "select_language": "భాషను ఎంచుకోండి",
        "welcome_back": "తిరిగి స్వాగతం",
        "login_subtitle": "FocusGuard కొనసాగించడానికి సైన్ ఇన్ చేయండి",
        "organization_admin": "సంస్థ నిర్వాహకుడు",
        "organization_admin_login_subtitle": "FocusGuard AI కు లాగిన్ చేయండి",
        "super_admin_login": "సూపర్ అడ్మిన్ లాగిన్",
        "employee_registration": "ఉద్యోగి నమోదు",
        "employee_registration_subtitle": "మీ FocusGuardAI ఖాతాను సృష్టించండి",
        "organization_admin_registration": "సంస్థ నిర్వాహక నమోదు",
        "organization_admin_registration_subtitle": "మీ నిర్వాహక ఖాతాను సృష్టించండి",
        "create_account": "ఖాతాను సృష్టించండి",
        "creating_account": "ఖాతా సృష్టిస్తోంది...",
        "logging_in": "లాగిన్ అవుతోంది...",
        "signing_in": "సైన్ ఇన్ అవుతోంది...",
        "secure_authentication": "JWT ద్వారా సురక్షిత ప్రమాణీకరణ",
        "productivity_tagline": "ఒక శక్తివంతమైన డాష్‌బోర్డ్‌తో ఉత్పాదకతను పర్యవేక్షించండి, కార్యకలాపాలను ట్రాక్ చేయండి, నివేదికలను విశ్లేషించండి మరియు దృష్టిని మెరుగుపరచండి.",
        "real_time_activity_tracking": "ప్రత్యక్ష కార్యకలాప ట్రాకింగ్",
        "ai_productivity_insights": "AI ఉత్పాదకత అవగాహనలు",
        "daily_analytics_reports": "రోజువారీ విశ్లేషణలు మరియు నివేదికలు",
        "already_have_account": "ఇప్పటికే ఖాతా ఉందా?",
        "forgot_password": "పాస్వర్డ్ మర్చిపోయారా?",
    },
    "bn": {
        "login": "লগইন",
        "register": "নিবন্ধন",
        "username": "ব্যবহারকারীর নাম",
        "email": "ইমেল",
        "password": "পাসওয়ার্ড",
        "confirm_password": "পাসওয়ার্ড নিশ্চিত করুন",
        "preferred_language": "পছন্দের ভাষা",
        "submit": "জমা দিন",
        "invitation_code": "আমন্ত্রণ কোড",
        "organization_name": "সংস্থার নাম",
        "select_language": "ভাষা নির্বাচন করুন",
        "welcome_back": "ফিরে আসায় স্বাগতম",
        "login_subtitle": "FocusGuard চালিয়ে যেতে সাইন ইন করুন",
        "organization_admin": "সংস্থা প্রশাসক",
        "organization_admin_login_subtitle": "FocusGuard AI-তে লগইন করুন",
        "super_admin_login": "সুপার অ্যাডমিন লগইন",
        "employee_registration": "কর্মচারী নিবন্ধন",
        "employee_registration_subtitle": "আপনার FocusGuardAI অ্যাকাউন্ট তৈরি করুন",
        "organization_admin_registration": "সংস্থা প্রশাসক নিবন্ধন",
        "organization_admin_registration_subtitle": "আপনার প্রশাসক অ্যাকাউন্ট তৈরি করুন",
        "create_account": "অ্যাকাউন্ট তৈরি করুন",
        "creating_account": "অ্যাকাউন্ট তৈরি হচ্ছে...",
        "logging_in": "লগইন হচ্ছে...",
        "signing_in": "সাইন ইন হচ্ছে...",
        "secure_authentication": "JWT দ্বারা নিরাপদ প্রমাণীকরণ",
        "productivity_tagline": "একটি শক্তিশালী ড্যাশবোর্ড দিয়ে উৎপাদনশীলতা পর্যবেক্ষণ করুন, কার্যকলাপ ট্র্যাক করুন, রিপোর্ট বিশ্লেষণ করুন এবং মনোযোগ উন্নত করুন.",
        "real_time_activity_tracking": "রিয়েল-টাইম কার্যকলাপ ট্র্যাকিং",
        "ai_productivity_insights": "AI উৎপাদনশীলতা অন্তর্দৃষ্টি",
        "daily_analytics_reports": "দৈনিক অ্যানালিটিক্স ও রিপোর্ট",
        "already_have_account": "ইতিমধ্যে অ্যাকাউন্ট আছে?",
        "forgot_password": "পাসওয়ার্ড ভুলে গেছেন?",
    },
}

FALLBACK_LANGUAGE_CODES = [
    "gu",
    "kn",
    "ml",
    "mr",
    "or",
    "pa",
]


def seed_public_translations(apps, schema_editor):
    Language = apps.get_model("users", "Language")
    Translation = apps.get_model("users", "Translation")

    for language_code in FALLBACK_LANGUAGE_CODES:
        PUBLIC_TRANSLATIONS.setdefault(
            language_code,
            PUBLIC_TRANSLATIONS["en"],
        )

    for language_code, translations in PUBLIC_TRANSLATIONS.items():
        language = Language.objects.filter(
            language_code=language_code
        ).first()

        if not language:
            continue

        for key, translated_text in translations.items():
            Translation.objects.update_or_create(
                language=language,
                key=key,
                defaults={
                    "translated_text": translated_text,
                },
            )


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0019_language_translation_user_preferred_language"),
    ]

    operations = [
        migrations.RunPython(
            seed_public_translations,
            migrations.RunPython.noop,
        ),
    ]
