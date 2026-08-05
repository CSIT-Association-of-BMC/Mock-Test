import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Target,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  BarChart3,
  ListChecks,
  Atom,
  FlaskConical,
  Calculator,
  Languages,
  Cpu,
} from "lucide-react";
import FaqAccordion from "@/components/custom/FaqAccordion";

const subjects = [
  {
    name: "Physics",
    slug: "physics",
    icon: Atom,
    color: "text-blue-600",
    bg: "bg-blue-50",
    desc: "Mechanics, optics, electricity & more",
  },
  {
    name: "Chemistry",
    slug: "chemistry",
    icon: FlaskConical,
    color: "text-green-600",
    bg: "bg-green-50",
    desc: "Organic, inorganic & physical chemistry",
  },
  {
    name: "Mathematics",
    slug: "mathematics",
    icon: Calculator,
    color: "text-purple-600",
    bg: "bg-purple-50",
    desc: "Algebra, calculus, trigonometry & more",
  },
  {
    name: "English",
    slug: "english",
    icon: Languages,
    color: "text-rose-600",
    bg: "bg-rose-50",
    desc: "Grammar, comprehension & vocabulary",
  },
  {
    name: "Computer",
    slug: "computer-science",
    icon: Cpu,
    color: "text-orange-600",
    bg: "bg-orange-50",
    desc: "Fundamentals, logic & basic programming",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
            <CheckCircle className="w-4 h-4" />
            B.Sc. CSIT Entrance Exam Preparation
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Practice Your
            <span className="block text-primary">CSIT Entrance Exam</span>
          </h1>
          <p className="text-md sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A comprehensive online practice platform by{" "}
            <strong>CSIT Association of BMC</strong>, featuring full mock tests,
            subject wise practice designed to help learners evaluate and
            improve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/practice">
              <Button className="text-white text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
                Practice Now
              </Button>
            </Link>
            <a href="https://csitabmc.com" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-4 h-auto rounded-sm cursor-pointer"
              >
                About Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                Practice by subject
              </h2>
              <p className="text-gray-600">
                Jump straight into the subject you want to strengthen.
              </p>
            </div>
            <Link
              href="/practice"
              className="group hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              View all mock tests
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {subjects.map((subject) => (
              <Link
                key={subject.slug}
                href={`/practice/subject/${subject.slug}`}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 ${subject.bg} rounded-xl flex items-center justify-center mb-5`}
                >
                  <subject.icon className={`w-6 h-6 ${subject.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {subject.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Practice now
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              Why choose our platform?
            </h2>
            <p className="text-gray-600">
              Everything you need to excel in your B.Sc. CSIT entrance exam
              preparation.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Target,
                color: "text-primary",
                bg: "bg-primary/10",
                title: "Full Mock Tests",
                desc: "Complete 100-question tests with a 2-hour timer under real exam conditions.",
              },
              {
                icon: BookOpen,
                color: "text-green-600",
                bg: "bg-green-50",
                title: "Subject Practice",
                desc: "Focus on individual subjects to sharpen your weak areas.",
              },
              {
                icon: Trophy,
                color: "text-purple-600",
                bg: "bg-purple-50",
                title: "Detailed Analytics",
                desc: "Subject-wise result breakdown and progress tracking.",
              },
              {
                icon: Users,
                color: "text-orange-600",
                bg: "bg-orange-50",
                title: "Flexible Access",
                desc: "Take tests anonymously, register only when you want to save results.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-200 rounded-2xl p-6"
              >
                <div
                  className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: ListChecks, value: "100", label: "Questions per test" },
              { icon: BookOpen, value: "5", label: "Core subjects covered" },
              { icon: Clock, value: "120", label: "Minutes of exam time" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 leading-none mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              How it works
            </h2>
            <p className="text-gray-600">
              Get exam-ready in three simple steps.
            </p>
          </div>
          <div className="relative grid md:grid-cols-3 gap-10">
            <div className="hidden md:block absolute top-6 left-[16.5%] right-[16.5%] h-px bg-gray-300" />
            {[
              {
                num: "1",
                icon: ListChecks,
                title: "Choose your test",
                desc: "Pick a full-length mock test or drill into a specific subject.",
              },
              {
                num: "2",
                icon: Clock,
                title: "Take it timed",
                desc: "Answer questions under real exam conditions with a live timer.",
              },
              {
                num: "3",
                icon: BarChart3,
                title: "Review & improve",
                desc: "Get instant, subject-wise analytics on where to focus next.",
              },
            ].map((item) => (
              <div key={item.num} className="relative pr-6">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center mb-5 relative z-10">
                  {item.num}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-gray-600">
              Everything you might want to know before you start.
            </p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-primary rounded-3xl px-8 py-12 sm:px-14 sm:py-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                Ready to ace your exam?
              </h2>
              <p className="text-white/70 max-w-md">
                Join thousands of students preparing for the B.Sc. CSIT
                entrance exam on our platform.
              </p>
            </div>
            <Link href="/practice" className="flex-shrink-0">
              <Button className="group bg-white text-primary hover:bg-white/90 text-base px-7 py-3.5 h-auto rounded-sm cursor-pointer">
                Get Started Now
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
