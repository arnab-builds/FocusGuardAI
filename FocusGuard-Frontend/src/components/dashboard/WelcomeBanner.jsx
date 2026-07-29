import { useLanguage } from "../../context/useLanguage";

const getGreetingKey = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return ["good_morning", "Good Morning"];
  }

  if (hour < 17) {
    return ["good_afternoon", "Good Afternoon"];
  }

  return ["good_evening", "Good Evening"];
};

export default function WelcomeBanner({ profile }) {
  const { currentLanguageCode, t } = useLanguage();
  const [greetingKey, greetingFallback] = getGreetingKey();

  const today = new Date().toLocaleDateString(
    currentLanguageCode || undefined,
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white shadow-md transition-all duration-300">
      <div className="absolute -right-10 top-4 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-white/5 blur-2xl"></div>

      <div className="relative z-10 grid gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-100/80">
          {today}
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-white">
          {t(greetingKey, greetingFallback)}
        </h1>

        {profile?.username && (
          <p className="text-lg font-medium text-white">
            {profile.username}
          </p>
        )}

        <p className="max-w-2xl text-sm leading-6 text-indigo-100/90">
          {t(
            "dashboard_welcome_summary",
            "Welcome to your FocusGuard dashboard. Here is your latest activity snapshot and insights."
          )}
        </p>
      </div>
    </div>
  );
}
