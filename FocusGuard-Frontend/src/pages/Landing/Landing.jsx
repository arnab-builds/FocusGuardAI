import { useState } from "react";
import {
  ArrowRight,
  Menu,
  X,
  Shield,
  Brain,
  BarChart3,
  Users,
  Activity,
  Globe,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Browser Tracking",
    value: "Real-time",
  },
  {
    title: "AI Insights",
    value: "Smart",
  },
  {
    title: "Organizations",
    value: "Multi-role",
  },
  {
    title: "Reports",
    value: "Daily",
  },
];

const navLinks = [
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "Workflow",
    href: "#workflow",
  },
  {
    name: "Dashboard",
    href: "#dashboard",
  },
  {
    name: "About",
    href: "#about",
  },
];

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main id="top" className="overflow-hidden bg-white text-slate-900">

      {/* ====================================================== */}
      {/* Background */}
      {/* ====================================================== */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-blue-200 blur-[140px]" />

        <div className="absolute right-[-80px] top-[180px] h-[350px] w-[350px] rounded-full bg-cyan-200 blur-[130px]" />

        <div className="absolute bottom-[-120px] left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-indigo-100 blur-[150px]" />

      </div>

      {/* ====================================================== */}
      {/* Navbar */}
      {/* ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-blue-100/70 bg-white/70 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">

              <Shield size={22} />

            </div>

            <div>

              <h1 className="text-2xl font-black tracking-tight">

                FocusGuard

                <span className="text-blue-600">
                  AI
                </span>

              </h1>

              <p className="text-xs text-slate-500">

                Employee Productivity Platform

              </p>

            </div>

          </Link>

          <nav className="hidden items-center gap-10 lg:flex">

            {navLinks.map((item) => (

              <a
                key={item.name}
                href={item.href}
                className="font-medium text-slate-600 transition hover:text-blue-600"
              >
                {item.name}
              </a>

            ))}

          </nav>

          <div className="hidden items-center gap-4 lg:flex">

            <Link
              to="/login"
              className="rounded-xl px-5 py-3 font-semibold text-slate-700 transition hover:bg-blue-50"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.03]"
            >
              Register
            </Link>

          </div>

          <button
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="lg:hidden"
          >
            {mobileOpen ? (
              <X />
            ) : (
              <Menu />
            )}
          </button>

        </div>

        {mobileOpen && (

          <div className="border-t bg-white lg:hidden">

            <div className="space-y-2 p-6">

              {navLinks.map((item) => (

                <a
                  key={item.name}
                  href={item.href}
                  className="block rounded-lg px-4 py-3 hover:bg-slate-100"
                >
                  {item.name}
                </a>

              ))}

              <Link
                to="/login"
                className="block rounded-lg bg-slate-100 px-4 py-3"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block rounded-lg bg-blue-600 px-4 py-3 text-white"
              >
                Register
              </Link>

            </div>

          </div>

        )}

      </header>

      {/* ====================================================== */}
      {/* Hero */}
      {/* ====================================================== */}

      <section className="relative">

        <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 py-24 lg:grid-cols-2">

          {/* Left */}

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">

              <Sparkles size={16} />

              AI Powered Productivity Platform

            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">

              Build Better

              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">

                Focus

              </span>

              Together.

            </h1>

            <p className="mt-8 max-w-xl text-xl leading-9 text-slate-600">

              FocusGuardAI helps organizations and individuals understand browser activity, improve productivity, receive AI-powered insights, and manage work more effectively from one intelligent platform.

            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                to="/register"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-xl transition hover:scale-[1.03]"
              >
                Get Started

                <ArrowRight
                  size={18}
                />

              </Link>

              <Link
                to="/login"
                className="rounded-2xl border border-slate-300 bg-white px-8 py-4 font-semibold transition hover:border-blue-600 hover:text-blue-600"
              >
                Login
              </Link>

            </div>

            {/* Highlights */}

            <div className="mt-12 grid gap-5 sm:grid-cols-2">

              <div className="flex items-center gap-3">

                <CheckCircle2 className="text-blue-600" />

                <span>

                  AI Productivity Recommendations

                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2 className="text-blue-600" />

                <span>

                  Browser Activity Tracking

                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2 className="text-blue-600" />

                <span>

                  Organization Management

                </span>

              </div>

              <div className="flex items-center gap-3">

                <CheckCircle2 className="text-blue-600" />

                <span>

                  Smart Analytics & Reports

                </span>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="relative">

            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-blue-200 blur-[90px]" />

            <div className="absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-cyan-200 blur-[80px]" />

            <div className="relative rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-[0_40px_90px_rgba(37,99,235,0.18)] backdrop-blur-xl">

              {/* Header */}

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">

                    Productivity Score

                  </p>

                  <h2 className="mt-2 text-5xl font-black text-blue-600">

                    92%

                  </h2>

                </div>

                <div className="rounded-2xl bg-blue-100 p-4">

                  <BarChart3
                    className="text-blue-600"
                    size={32}
                  />

                </div>

              </div>

              <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">

                <div className="flex items-center gap-3">

                  <Brain />

                  <h3 className="font-bold">

                    AI Recommendation

                  </h3>

                </div>

                <p className="mt-4 leading-7 text-blue-50">

                  Your productivity is highest during morning hours. Schedule deep work before noon and reduce context switching for better focus.

                </p>

              </div>

              <div className="mt-8 space-y-5">

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <Globe className="text-blue-600" />

                    Browser Tracking

                  </div>

                  <span className="font-semibold text-blue-600">

                    Active

                  </span>

                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <Users className="text-indigo-600" />

                    Organizations

                  </div>

                  <ChevronRight />

                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <Activity className="text-cyan-600" />

                    Analytics

                  </div>

                  <ChevronRight />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* Stats */}
      {/* ====================================================== */}

      <section className="pb-20">

        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((item) => (

            <div
              key={item.title}
              className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-lg backdrop-blur-xl transition hover:-translate-y-2 hover:shadow-xl"
            >

              <h3 className="text-4xl font-black text-blue-600">

                {item.value}

              </h3>

              <p className="mt-3 text-slate-600">

                {item.title}

              </p>

            </div>

          ))}

        </div>

      </section>
            {/* ====================================================== */}
      {/* Features */}
      {/* ====================================================== */}

      <section
        id="features"
        className="relative py-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-white to-cyan-50/40" />

        <div className="relative mx-auto max-w-7xl px-6">

          <div className="text-center">

            <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">

              Everything you need

            </span>

            <h2 className="mt-6 text-5xl font-black tracking-tight">

              Built for modern teams.

            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">

              From secure onboarding to browser activity tracking and AI-powered
              recommendations, FocusGuardAI provides organizations with a single,
              intelligent productivity platform.

            </p>

          </div>

          {/* Bento Grid */}

          <div className="mt-20 grid gap-8 lg:grid-cols-3">

            {/* AI CARD */}

            <div className="group relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-10 text-white shadow-2xl transition duration-500 hover:-translate-y-3 lg:col-span-2">

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />

              <Brain size={48} />

              <h3 className="mt-8 text-4xl font-black">

                AI Productivity Coach

              </h3>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50">

                Receive personalized productivity recommendations based on
                browsing behavior, work patterns, focus sessions and activity
                trends to help improve daily efficiency.

              </p>

              <div className="mt-10 flex flex-wrap gap-3">

                {[
                  "Personalized Insights",
                  "Smart Suggestions",
                  "Daily Analysis",
                  "Work Pattern Detection",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/20 px-4 py-2 text-sm"
                  >
                    {item}
                  </span>
                ))}

              </div>

            </div>

            {/* Browser Tracking */}

            <div className="group rounded-[30px] border border-blue-100 bg-white p-8 shadow-xl transition duration-300 hover:-translate-y-3 hover:border-blue-300">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

                <Globe className="text-blue-600" size={30} />

              </div>

              <h3 className="mt-8 text-2xl font-bold">

                Browser Activity Tracking

              </h3>

              <p className="mt-5 leading-7 text-slate-600">

                Track productive and non-productive website usage while providing
                organizations with meaningful activity insights.

              </p>

            </div>

            {/* Analytics */}

            <div className="group rounded-[30px] border border-blue-100 bg-white p-8 shadow-xl transition hover:-translate-y-3">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100">

                <BarChart3
                  className="text-cyan-600"
                  size={30}
                />

              </div>

              <h3 className="mt-8 text-2xl font-bold">

                Productivity Analytics

              </h3>

              <p className="mt-5 leading-7 text-slate-600">

                Visualize productivity trends, work efficiency and browsing
                patterns through intuitive dashboards.

              </p>

            </div>

            {/* Reports */}

            <div className="group rounded-[30px] border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 shadow-xl transition hover:-translate-y-3">

              <Activity
                size={34}
                className="text-blue-600"
              />

              <h3 className="mt-8 text-2xl font-bold">

                Smart Reports

              </h3>

              <p className="mt-5 leading-7 text-slate-600">

                Generate detailed productivity reports for organizations and
                employees with meaningful summaries.

              </p>

            </div>

            {/* Invitation */}

            <div className="group rounded-[30px] border border-blue-100 bg-white p-8 shadow-xl transition hover:-translate-y-3">

              <Users
                className="text-indigo-600"
                size={34}
              />

              <h3 className="mt-8 text-2xl font-bold">

                Employee Invitations

              </h3>

              <p className="mt-5 leading-7 text-slate-600">

                Secure invitation-based onboarding allows employees to register
                safely through organization-issued invitation links.

              </p>

            </div>

            {/* Secure */}

            <div className="group rounded-[30px] border border-blue-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-8 shadow-xl transition hover:-translate-y-3">

              <Shield
                className="text-indigo-600"
                size={34}
              />

              <h3 className="mt-8 text-2xl font-bold">

                Secure Authentication

              </h3>

              <p className="mt-5 leading-7 text-slate-600">

                Multiple user roles with secure authentication and protected
                access for every organization.

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* Workflow */}
      {/* ====================================================== */}

      <section
        id="workflow"
        className="py-24"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">

              Simple Workflow

            </span>

            <h2 className="mt-6 text-5xl font-black">

              How FocusGuardAI Works

            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">

              From organization setup to AI-driven productivity insights,
              everything follows a simple and secure workflow.

            </p>

          </div>

          <div className="relative mt-24">

            <div className="absolute left-1/2 top-10 hidden h-[80%] w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-500 via-indigo-500 to-cyan-400 lg:block" />

            <div className="space-y-16">

              {[
                {
                  number: "01",
                  title: "Create Organization",
                  desc: "A Super Admin creates an organization and assigns an Organization Admin.",
                },
                {
                  number: "02",
                  title: "Invite Employees",
                  desc: "Organization Admin securely invites employees using email invitations.",
                },
                {
                  number: "03",
                  title: "Track Browser Activity",
                  desc: "Employees work normally while browser activity is monitored for productivity insights.",
                },
                {
                  number: "04",
                  title: "Receive AI Recommendations",
                  desc: "FocusGuardAI analyzes productivity patterns and generates personalized recommendations.",
                },
              ].map((step, index) => (

                <div
                  key={step.number}
                  className={`flex flex-col items-center gap-8 lg:flex-row ${
                    index % 2 ? "lg:flex-row-reverse" : ""
                  }`}
                >

                  <div className="flex-1">

                    <div className="rounded-[30px] border border-blue-100 bg-white p-10 shadow-xl transition hover:-translate-y-2">

                      <span className="text-5xl font-black text-blue-600">

                        {step.number}

                      </span>

                      <h3 className="mt-6 text-3xl font-bold">

                        {step.title}

                      </h3>

                      <p className="mt-5 text-lg leading-8 text-slate-600">

                        {step.desc}

                      </p>

                    </div>

                  </div>

                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-3xl font-black text-white shadow-2xl">

                    {step.number}

                  </div>

                  <div className="hidden flex-1 lg:block" />

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>
            {/* ====================================================== */}
      {/* Dashboard Showcase */}
      {/* ====================================================== */}

      <section
        id="dashboard"
        className="relative overflow-hidden py-28"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/50 to-white" />

        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-200/40 blur-[120px]" />

        <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6">

          <div className="text-center">

            <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">

              Platform Preview

            </span>

            <h2 className="mt-6 text-5xl font-black">

              Everything in one dashboard

            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">

              Monitor productivity, analyze browser activity, manage
              organizations and receive AI-powered recommendations from a
              single intelligent workspace.

            </p>

          </div>

          <div className="mt-20">

            <div className="rounded-[40px] border border-white bg-white/80 p-8 shadow-[0_40px_80px_rgba(37,99,235,.12)] backdrop-blur-xl">

              {/* Top */}

              <div className="flex flex-wrap items-center justify-between gap-5 border-b pb-6">

                <div>

                  <h3 className="text-2xl font-bold">

                    FocusGuard Dashboard

                  </h3>

                  <p className="mt-2 text-slate-500">

                    Productivity Overview

                  </p>

                </div>

                <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white shadow-lg">

                  Live Monitoring

                </div>

              </div>

              {/* Grid */}

              <div className="mt-8 grid gap-6 lg:grid-cols-3">

                {/* Analytics */}

                <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-7 text-white">

                  <p className="text-blue-100">

                    Productivity Score

                  </p>

                  <h2 className="mt-3 text-6xl font-black">

                    92%

                  </h2>

                  <div className="mt-8 h-3 rounded-full bg-white/20">

                    <div className="h-full w-[92%] rounded-full bg-white" />

                  </div>

                </div>

                {/* Browser */}

                <div className="rounded-3xl border p-7">

                  <div className="flex items-center justify-between">

                    <h4 className="font-bold">

                      Browser Usage

                    </h4>

                    <Globe className="text-blue-600" />

                  </div>

                  <div className="mt-8 space-y-5">

                    <div>

                      <div className="flex justify-between">

                        <span>Productive</span>

                        <span>78%</span>

                      </div>

                      <div className="mt-2 h-2 rounded-full bg-slate-100">

                        <div className="h-full w-[78%] rounded-full bg-green-500" />

                      </div>

                    </div>

                    <div>

                      <div className="flex justify-between">

                        <span>Neutral</span>

                        <span>14%</span>

                      </div>

                      <div className="mt-2 h-2 rounded-full bg-slate-100">

                        <div className="h-full w-[14%] rounded-full bg-yellow-400" />

                      </div>

                    </div>

                    <div>

                      <div className="flex justify-between">

                        <span>Unproductive</span>

                        <span>8%</span>

                      </div>

                      <div className="mt-2 h-2 rounded-full bg-slate-100">

                        <div className="h-full w-[8%] rounded-full bg-red-500" />

                      </div>

                    </div>

                  </div>

                </div>

                {/* Recommendation */}

                <div className="rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-500 p-7 text-white">

                  <Brain size={34} />

                  <h3 className="mt-6 text-2xl font-bold">

                    AI Recommendation

                  </h3>

                  <p className="mt-4 leading-7 text-blue-50">

                    Schedule focused work during your most productive hours
                    and minimize frequent context switching.

                  </p>

                </div>

              </div>

              {/* Bottom Cards */}

              <div className="mt-8 grid gap-6 md:grid-cols-3">

                <div className="rounded-2xl bg-blue-50 p-6">

                  <Users className="text-blue-600" />

                  <h3 className="mt-5 font-bold">

                    Organizations

                  </h3>

                  <p className="mt-2 text-slate-600">

                    Manage employees and departments effortlessly.

                  </p>

                </div>

                <div className="rounded-2xl bg-cyan-50 p-6">

                  <Activity className="text-cyan-600" />

                  <h3 className="mt-5 font-bold">

                    Activity Timeline

                  </h3>

                  <p className="mt-2 text-slate-600">

                    View browser activity with intelligent analytics.

                  </p>

                </div>

                <div className="rounded-2xl bg-indigo-50 p-6">

                  <Shield className="text-indigo-600" />

                  <h3 className="mt-5 font-bold">

                    Secure Access

                  </h3>

                  <p className="mt-2 text-slate-600">

                    Protected authentication across every user role.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* About */}
      {/* ====================================================== */}

      <section
        id="about"
        className="py-28"
      >

        <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">

          <div>

            <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">

              About FocusGuardAI

            </span>

            <h2 className="mt-8 text-5xl font-black">

              Helping teams work smarter.

            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-600">

              FocusGuardAI enables organizations to understand productivity,
              improve employee focus and make informed decisions through
              analytics, AI recommendations and browser activity insights.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <div className="rounded-full bg-blue-100 px-5 py-3 font-semibold text-blue-700">

                Secure

              </div>

              <div className="rounded-full bg-cyan-100 px-5 py-3 font-semibold text-cyan-700">

                Intelligent

              </div>

              <div className="rounded-full bg-indigo-100 px-5 py-3 font-semibold text-indigo-700">

                Scalable

              </div>

            </div>

          </div>

          <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    icon: Brain,
                    title: "AI Productivity Coach",
                    description: "Personalized recommendations generated from real activity data and analytics.",
                  },
                  {
                    icon: Globe,
                    title: "Browser Activity Tracking",
                    description: "Automatic logging of sites, tabs, and focus time as work happens.",
                  },
                  {
                    icon: Users,
                    title: "Organization Management",
                    description: "Manage employees, permissions, and analytics from one console.",
                  },
                  {
                    icon: Shield,
                    title: "Secure Authentication",
                    description: "JWT-based auth and role-based access keep every organization's data separate.",
                  },
                ].map((card) => (
                  <div key={card.title}>
                    <div className="group relative h-full overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-[#EAF0FE]/80 p-6 shadow-[0_16px_40px_-28px_rgba(79,70,229,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#4F46E5]/25 hover:shadow-[0_24px_55px_-24px_rgba(79,70,229,0.4)]">
                      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#4F46E5]/[0.08] blur-2xl transition-transform duration-500 group-hover:scale-110" />
                      <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#2F8FF0] text-white shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)]">
                        <card.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display relative mt-5 text-[15.5px] font-semibold tracking-tight text-[#12141F]">
                        {card.title}
                      </h3>
                      <p className="relative mt-2 text-[13px] leading-6 text-[#5B6072]">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </section>

        {/* ============================================================ */}
        {/* FINAL CTA — large rounded gradient glass container             */}
        {/* ============================================================ */}
        <section className="relative border-t border-black/[0.04] bg-[#F6F8FF] py-28">
          <div className="mx-auto max-w-6xl px-6">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#4F46E5] via-[#6C4FF0] to-[#2F8FF0] px-8 py-20 text-center shadow-[0_40px_90px_-30px_rgba(79,70,229,0.55)] sm:px-16">
                <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:26px_26px]" />
                <div className="blob-a pointer-events-none absolute left-[8%] top-0 h-72 w-72 rounded-full bg-white/[0.12] blur-[100px]" />
                <div className="blob-b pointer-events-none absolute right-[8%] bottom-0 h-72 w-72 rounded-full bg-white/[0.10] blur-[100px]" />
                <div className="blob-c pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.08] blur-[90px]" />

                <div className="relative mx-auto max-w-2xl">
                  <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
                    Ready to improve your team's productivity?
                  </h2>
                  <p className="mt-4 text-white/75">
                    Set up your organization and invite your first employees today.
                  </p>
                  <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                    <Link
                      to="/register"
                      className="rounded-xl bg-white px-7 py-4 text-[15px] font-semibold text-[#4F46E5] shadow-[0_20px_50px_-14px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="rounded-xl border border-white/40 bg-white/10 px-7 py-4 text-[15px] font-semibold text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FOOTER — light                                                 */}
        {/* ============================================================ */}
        <footer id="contact" className="border-t border-black/[0.06] bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <a href="#top" className="flex items-center gap-2.5">
                  <span className="font-display text-[19px] font-bold text-[#12141F]">
                    FocusGuard
                    <span className="bg-gradient-to-r from-[#4F46E5] to-[#2F8FF0] bg-clip-text text-transparent">AI</span>
                  </span>
                </a>
                <p className="mt-3 text-sm leading-6 text-[#5B6072]">
                  Browser activity tracking, analytics, and AI-powered productivity insights for teams and individuals.
                </p>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-black/30">About</p>
                <p className="mt-3 text-sm leading-6 text-[#5B6072]">
                  Contact your FocusGuardAI administrator for support or organization access.
                </p>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-black/30">Quick links</p>
                <ul className="mt-3 space-y-2 text-sm text-[#5B6072]">
                  <li><a href="#features" className="transition hover:text-[#4F46E5]">Features</a></li>
                  <li><a href="#workflow" className="transition hover:text-[#4F46E5]">How it works</a></li>
                  <li><a href="#about" className="transition hover:text-[#4F46E5]">About</a></li>
                  <li><Link to="/login" className="transition hover:text-[#4F46E5]">Login</Link></li>
                  <li><Link to="/register" className="transition hover:text-[#4F46E5]">Register</Link></li>
                </ul>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-black/30">Contact</p>
                <ul className="mt-3 space-y-2 text-sm text-[#5B6072]">
                  <li><a href="#contact" className="transition hover:text-[#4F46E5]">Reach the team</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t border-black/[0.06] pt-6 text-center text-xs text-black/30">
              &copy; {new Date().getFullYear()} FocusGuardAI. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
  );
}
