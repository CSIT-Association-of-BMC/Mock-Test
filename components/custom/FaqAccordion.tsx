"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Is this platform free to use?",
    a: "Yes. You can take full mock tests and subject-wise practice for free. Creating an account is only needed if you want to save your results and track progress over time.",
  },
  {
    q: "Do I need to register before taking a test?",
    a: "No. You can start practicing right away as a guest. Registering just lets you save your scores and come back to review them later from your dashboard.",
  },
  {
    q: "How closely does the mock test follow the real exam pattern?",
    a: "Full mock tests contain 100 questions with a 2-hour timer, matching the structure and time constraints of the actual B.Sc. CSIT entrance exam.",
  },
  {
    q: "Can I practice individual subjects instead of a full test?",
    a: "Yes. You can focus on Physics, Chemistry, Mathematics, English, or Computer Science individually to strengthen specific weak areas.",
  },
  {
    q: "Will I get a breakdown of my performance?",
    a: "After every test, you get a subject-wise breakdown of your score so you know exactly where to focus your next study session.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="text-base font-medium text-gray-900">
                {faq.q}
              </span>
              <Plus
                className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-200 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-gray-600 text-sm leading-relaxed pb-5 pr-8">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
