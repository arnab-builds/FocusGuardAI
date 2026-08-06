import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiTrendingUp,
  FiUsers,
  FiShield,
  FiCpu,
  FiMail,
  FiLayers,
  FiBarChart2,
  FiGlobe,
  FiMenu,
  FiX,
} from "react-icons/fi";

/* ================================================================== */
/*  DESIGN TOKENS                                                      */
/*  Light, cinematic — retinted to match the FocusGuard login screen's */
/*  indigo → violet → blue gradient identity, on a cool paper-white    */
/*  base instead of flat dark chrome.                                  */
/*  Base       #F5F7FE     Ink        #12141A                          */
/*  Surface    #FFFFFF     Muted      #5B5F6B                          */
/*  Line       rgba(15,23,42,.08)                                      */
/*  Indigo     #5B4FE5  (signature accent, "active tab" / primary CTA) */
/*  Violet     #7C4FE0  (gradient partner to indigo, buttons + text)   */
/*  Blue       #2F6FED  (data / secondary accent)                      */
/*  Violet-lt  #7C6FE0  (ambient aurora only, not UI)                  */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  Scroll reveal                                                       */
/* ------------------------------------------------------------------ */
function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transform transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        shown ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.98]"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  Typewriter — cycles through what the platform reveals. Respects    */
/*  prefers-reduced-motion by simply showing the first phrase.         */
/* ------------------------------------------------------------------ */
function Typewriter({ words, typeSpeed = 55, deleteSpeed = 30, holdMs = 1400 }) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setText(words[0]);
      return;
    }
    const current = words[wordIndex % words.length];
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), holdMs);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, typeSpeed, deleteSpeed, holdMs, reduced]);

  return (
    <span className="relative inline-block">
      <span className="bg-gradient-to-r from-[#5B4FE5] via-[#7C4FE0] to-[#2F6FED] bg-clip-text text-transparent">
        {text}
      </span>
      <span
        aria-hidden="true"
        className={`ml-1 inline-block h-[0.85em] w-[3px] translate-y-[3px] bg-[#5B4FE5] ${
          reduced ? "opacity-0" : "animate-[caret_1s_steps(1)_infinite]"
        }`}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Data — grounded strictly in the actual product capabilities        */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: FiGlobe,
    title: "Browser activity tracking",
    description:
      "The Chrome extension logs websites, active tabs, tab switches, and browsing duration as work happens — no manual timers.",
  },
  {
    icon: FiBarChart2,
    title: "Productivity analytics",
    description:
      "Productive time, non-productive time, website usage, and inactivity, laid out in a dashboard that's easy to read at a glance.",
  },
  {
    icon: FiCpu,
    title: "AI productivity coach",
    description:
      "Personalized recommendations generated from activity logs and analytics — practical suggestions, not generic tips.",
  },
  {
    icon: FiTrendingUp,
    title: "Smart reports",
    description:
      "Daily, weekly, and monthly reports with insights and website summaries, ready to review or share with a manager.",
  },
  {
    icon: FiMail,
    title: "Invitation-based onboarding",
    description:
      "Organization admins invite employees by secure email. Registration happens through the invite — there's no open sign-up.",
  },
  {
    icon: FiUsers,
    title: "Multi-role platform",
    description:
      "Purpose-built access for Super Admins, Organization Admins, Employees, and standalone users, each with their own dashboard.",
  },
  {
    icon: FiLayers,
    title: "Organization management",
    description:
      "Manage organizations, employees, activity, permissions, and analytics from one place instead of stitching tools together.",
  },
  {
    icon: FiShield,
    title: "Privacy & security",
    description:
      "JWT authentication, role-based access, and protected APIs keep every organization's data separate and secure.",
  },
];

const workflow = [
  "Organization created",
  "Organization admin invited",
  "Employees invited",
  "Employee registration",
  "Chrome extension login",
  "Activity tracking begins",
  "Analytics generated",
  "AI recommendations",
  "Reports & insights",
];

/* ------------------------------------------------------------------ */
/*  Navbar                                                              */
/* ------------------------------------------------------------------ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-black/[0.06] bg-white/75 backdrop-blur-xl shadow-[0_1px_0_0_rgba(15,23,42,0.04)]" : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="font-[General_Sans,ui-sans-serif] text-[17px] font-semibold tracking-tight text-[#12141A]">
            FocusGuard<span className="text-[#5B4FE5]">AI</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[#5B5F6B] transition-colors hover:text-[#12141A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B4FE5]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#12141A]/80 transition hover:bg-black/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B4FE5]"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-gradient-to-r from-[#5B4FE5] to-[#7C4FE0] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B4FE5]"
          >
            Register
          </Link>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-[#12141A]/80 hover:bg-black/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5B4FE5] md:hidden"
        >
          {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/[0.06] bg-white/95 px-6 py-5 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-[#5B5F6B] hover:bg-black/[0.04] hover:text-[#12141A]"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-black/[0.06] pt-4">
            <Link to="/login" className="rounded-lg border border-black/10 px-4 py-2.5 text-center text-sm font-medium text-[#12141A]/85">
              Login
            </Link>
            <Link to="/register" className="rounded-lg bg-gradient-to-r from-[#5B4FE5] to-[#7C4FE0] px-4 py-2.5 text-center text-sm font-semibold text-white">
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  BrowserMock — light-glass dashboard, browser-tab motif preserved   */
/* ------------------------------------------------------------------ */
function BrowserMock() {
  const bars = [34, 58, 42, 76, 52, 68, 88];
  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white/80 shadow-[0_50px_100px_-30px_rgba(30,20,60,0.28)] backdrop-blur-2xl">
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-black/[0.02] px-3 pt-2.5">
        <div className="mb-2 flex items-center gap-1.5 pr-1">
          <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
        </div>
        <div className="flex flex-1 items-end gap-1 overflow-hidden">
          {["Docs", "FocusGuardAI", "Mail"].map((t, i) => (
            <div
              key={t}
              className={`flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-[11px] font-medium ${
                i === 1 ? "bg-white text-[#5B4FE5]" : "text-black/35"
              }`}
              style={i === 1 ? { boxShadow: "inset 0 2px 0 0 #5B4FE5" } : {}}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-[#5B4FE5]" : "bg-black/20"}`} />
              {t}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 bg-white p-4">
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2 rounded-xl border border-black/[0.06] bg-gradient-to-br from-[#EEF0FE] to-white p-3.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-black/35">Productivity score</p>
            <div className="mt-3 flex items-end justify-between">
              <span className="font-[General_Sans,ui-sans-serif] text-3xl font-bold text-[#12141A]">86</span>
              <span className="font-mono text-[11px] text-[#2F6FED]">+4.2%</span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-black/[0.06]">
              <div className="h-1.5 w-[86%] rounded-full bg-gradient-to-r from-[#5B4FE5] to-[#2F6FED]" />
            </div>
          </div>

          <div className="col-span-3 rounded-xl border border-black/[0.06] bg-white p-3.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-black/35">Weekly activity</p>
            <div className="mt-3 flex h-16 items-end gap-1.5">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#2F6FED]/70 to-[#2F6FED]/15" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-[#5B4FE5]/25 bg-[#EEF0FE] p-3.5">
          <div className="mt-0.5 rounded-md bg-[#5B4FE5]/15 p-1.5">
            <FiCpu className="h-3.5 w-3.5 text-[#5B4FE5]" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#4A3FD1]">AI recommendation</p>
            <p className="mt-1 text-xs leading-5 text-black/60">
              Tab switches spike after 2pm. A 15-minute focus block before your next meeting could help.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-black/[0.06] bg-white p-3.5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-black/35">Website tracking</p>
          <div className="mt-2.5 space-y-2">
            {[
              ["docs.google.com", "Productive", "1h 20m"],
              ["github.com", "Productive", "48m"],
              ["youtube.com", "Non-productive", "12m"],
            ].map(([site, tag, time]) => (
              <div key={site} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-black/65">
                  <span className={`h-1.5 w-1.5 rounded-full ${tag === "Productive" ? "bg-[#2F6FED]" : "bg-black/20"}`} />
                  {site}
                </div>
                <span className="text-black/35">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default function Landing() {
  return (
    <main id="top" className="bg-[#F5F7FE] font-[General_Sans,ui-sans-serif,system-ui]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=General+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
        .font-display { font-family: 'General Sans', ui-sans-serif, system-ui; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        @keyframes caret { 0%,45% { opacity: 1; } 46%,100% { opacity: 0; } }
        @keyframes drift-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-24px) scale(1.06); } }
        @keyframes drift-b { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-36px,26px) scale(1.08); } }
        @keyframes drift-c { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(18px,20px) scale(0.94); } }
        @keyframes float-y { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(4deg); } }
        .blob-a { animation: drift-a 15s ease-in-out infinite; }
        .blob-b { animation: drift-b 19s ease-in-out infinite; }
        .blob-c { animation: drift-c 17s ease-in-out infinite; }
        .floaty { animation: float-y 6s ease-in-out infinite; }
        .floaty-slow { animation: float-y 9s ease-in-out infinite; animation-delay: -3s; }
        @media (prefers-reduced-motion: reduce) {
          .blob-a, .blob-b, .blob-c, .floaty, .floaty-slow { animation: none; }
        }
      `}</style>

      <Navbar />

      {/* ---------------------------------------------------------- */}
      {/* HERO — cinematic aurora mesh, glass panel, typewriter        */}
      {/* ---------------------------------------------------------- */}
      <section className="relative isolate overflow-hidden pt-40 pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#FFFFFF_0%,#F5F7FE_55%)]" />
        <div className="blob-a pointer-events-none absolute -left-28 top-8 -z-10 h-[26rem] w-[26rem] rounded-full bg-[#5B4FE5]/20 blur-[110px]" />
        <div className="blob-b pointer-events-none absolute right-[-8rem] top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[#2F6FED]/20 blur-[110px]" />
        <div className="blob-c pointer-events-none absolute bottom-[-8rem] left-1/3 -z-10 h-[22rem] w-[22rem] rounded-full bg-[#7C6FE0]/[0.16] blur-[110px]" />

        {/* floating abstract shapes */}
        <div className="floaty pointer-events-none absolute left-[8%] top-32 -z-10 hidden h-14 w-14 rounded-2xl border border-black/[0.06] bg-white/60 shadow-lg backdrop-blur-md lg:block" />
        <div className="floaty-slow pointer-events-none absolute right-[14%] top-[26rem] -z-10 hidden h-10 w-10 rounded-full border border-black/[0.06] bg-white/60 shadow-lg backdrop-blur-md lg:block" />

        <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/70 px-3.5 py-1.5 font-mono text-[11px] text-[#5B5F6B] shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5B4FE5]" />
              now tracking, in real time
            </p>
            <h1 className="font-display min-h-[3.6em] text-[2.6rem] font-bold leading-[1.1] tracking-tight text-[#12141A] sm:min-h-[3.2em] sm:text-6xl">
              See where the
              <br />
              <Typewriter
                words={["workday goes.", "hours disappear.", "focus breaks.", "team's time goes."]}
              />
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#5B5F6B]">
              FocusGuardAI tracks browser activity, turns it into clear productivity analytics, and coaches your team
              toward better focus — all from one platform for employees, organizations, and admins.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#5B4FE5] to-[#7C4FE0] px-6 py-3.5 font-semibold text-white shadow-[0_16px_40px_-14px_rgba(91,79,229,0.5)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B4FE5]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Get started
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-black/10 bg-white/70 px-6 py-3.5 font-semibold text-[#12141A]/90 backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B4FE5]"
              >
                Login
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150} className="hidden md:block">
            <BrowserMock />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* FEATURES                                                    */}
      {/* ---------------------------------------------------------- */}
      <section id="features" className="relative border-t border-black/[0.05] bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#5B4FE5]">Features</p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-[#12141A] sm:text-4xl">
              What the platform actually does.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 4) * 80}>
                <article className="group h-full rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5B4FE5]/30 hover:shadow-xl hover:shadow-[#5B4FE5]/[0.08]">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/[0.06] bg-[#F5F7FE] text-[#5B4FE5] transition-colors group-hover:bg-[#EEF0FE]">
                    <f.icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="mt-4 font-display text-[15px] font-semibold text-[#12141A]">{f.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-6 text-[#5B5F6B]">{f.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* WORKFLOW                                                    */}
      {/* ---------------------------------------------------------- */}
      <section className="relative border-t border-black/[0.05] bg-[#F5F7FE] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#2F6FED]">How it flows</p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-[#12141A] sm:text-4xl">
              From org setup to insight.
            </h2>
          </Reveal>

          <div className="mt-14 overflow-x-auto">
            <div className="flex min-w-[820px] items-start gap-0 px-1 lg:min-w-0">
              {workflow.map((step, i) => (
                <Reveal key={step} delay={i * 60} className="flex flex-1 flex-col items-center text-center">
                  <div className="flex w-full items-center">
                    <div className={`h-px flex-1 ${i === 0 ? "bg-transparent" : "bg-black/10"}`} />
                    <div className="mx-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white font-mono text-[11px] text-[#5B4FE5] shadow-sm">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className={`h-px flex-1 ${i === workflow.length - 1 ? "bg-transparent" : "bg-black/10"}`} />
                  </div>
                  <p className="mt-3 px-2 text-xs leading-5 text-[#5B5F6B]">{step}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* DASHBOARD PREVIEW                                           */}
      {/* ---------------------------------------------------------- */}
      <section className="relative overflow-hidden border-t border-black/[0.05] bg-white py-24">
        <div className="blob-a pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-[#5B4FE5]/[0.10] blur-[100px]" />
        <div className="blob-b pointer-events-none absolute right-[-6rem] bottom-0 -z-10 h-72 w-72 rounded-full bg-[#2F6FED]/[0.10] blur-[100px]" />
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#5B4FE5]">Dashboard</p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-[#12141A] sm:text-4xl">
              One workspace, every signal.
            </h2>
            <p className="mt-3 text-[#5B5F6B]">Representative UI — analytics, AI coach, and activity in one glanceable view.</p>
          </Reveal>

          <Reveal delay={150} className="mx-auto mt-14 max-w-3xl">
            <BrowserMock />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* ABOUT                                                       */}
      {/* ---------------------------------------------------------- */}
      <section id="about" className="relative border-t border-black/[0.05] bg-[#F5F7FE] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#2F6FED]">About</p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-[#12141A] sm:text-4xl">
              What FocusGuardAI is for.
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-[#5B5F6B]">
              FocusGuardAI helps organizations and individuals understand how work actually happens. A lightweight
              Chrome extension tracks browser activity, the platform turns that activity into analytics and reports,
              and an AI coach translates the data into recommendations people can act on — all inside role-based
              dashboards for admins, organizations, and employees.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* CTA — cinematic gradient close                              */}
      {/* ---------------------------------------------------------- */}
      <section className="relative overflow-hidden border-t border-black/[0.05] py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#EEF0FE] via-[#F5F7FE] to-[#E7EEFE]" />
        <div className="blob-a pointer-events-none absolute left-[10%] top-0 -z-10 h-72 w-72 rounded-full bg-[#5B4FE5]/[0.18] blur-[100px]" />
        <div className="blob-b pointer-events-none absolute right-[10%] bottom-0 -z-10 h-72 w-72 rounded-full bg-[#2F6FED]/[0.18] blur-[100px]" />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#12141A] sm:text-4xl">
              Ready to improve your team's productivity?
            </h2>
            <p className="mt-3 text-[#5B5F6B]">Set up your organization and invite your first employees today.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-[#5B4FE5] to-[#7C4FE0] px-6 py-3.5 font-semibold text-white shadow-[0_16px_40px_-14px_rgba(91,79,229,0.5)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B4FE5]"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-black/10 bg-white/80 px-6 py-3.5 font-semibold text-[#12141A]/90 backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B4FE5]"
              >
                Login
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* FOOTER                                                      */}
      {/* ---------------------------------------------------------- */}
      <footer id="contact" className="border-t border-black/[0.06] bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <a href="#top" className="flex items-center gap-2.5">
                <span className="font-display text-[15px] font-semibold text-[#12141A]">
                  FocusGuard<span className="text-[#5B4FE5]">AI</span>
                </span>
              </a>
              <p className="mt-3 text-sm leading-6 text-[#5B5F6B]">
                Browser activity tracking, analytics, and AI-powered productivity insights for teams and individuals.
              </p>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-black/35">About</p>
              <p className="mt-3 text-sm leading-6 text-[#5B5F6B]">
                Contact your FocusGuardAI administrator for support or organization access.
              </p>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-black/35">Quick links</p>
              <ul className="mt-3 space-y-2 text-sm text-[#5B5F6B]">
                <li><a href="#features" className="transition hover:text-[#12141A]">Features</a></li>
                <li><a href="#about" className="transition hover:text-[#12141A]">About</a></li>
                <li><Link to="/login" className="transition hover:text-[#12141A]">Login</Link></li>
                <li><Link to="/register" className="transition hover:text-[#12141A]">Register</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-black/35">Contact</p>
              <ul className="mt-3 space-y-2 text-sm text-[#5B5F6B]">
                <li><a href="#contact" className="transition hover:text-[#12141A]">Reach the team</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-black/[0.06] pt-6 text-center text-xs text-black/35">
            &copy; {new Date().getFullYear()} FocusGuardAI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}