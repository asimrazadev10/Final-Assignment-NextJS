'use client';

import { useState, FormEvent, ChangeEvent, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

// --- Types ---
interface FormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

interface ContactMethod {
  icon: ReactNode;
  title: string;
  description: string;
  contact: string;
  action: string | null;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      alert(
        "Thank you for reaching out! We'll get back to you within 24 hours."
      );
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods: ContactMethod[] = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email Us",
      description: "Get in touch via email for detailed inquiries",
      contact: "hello@subflow.pk",
      action: "mailto:hello@subflow.pk",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      title: "WhatsApp",
      description: "Quick questions? Message us on WhatsApp",
      contact: "+92 339 0054595",
      action: "https://wa.me/923390554595",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Based in Pakistan",
      description: "Proud to be a Pakistani startup",
      contact: "Gujrat, Punjab, Pakistan",
      action: null,
    },
  ];

  const faqItems: FaqItem[] = [
    {
      question: "How does SubFlow detect my subscriptions?",
      answer:
        "Our Subscription Inbox feature analyzes your email to automatically detect subscription receipts, renewals, and sign-ups. You can also manually add any subscriptions we might miss.",
    },
    {
      question: "Is my financial data secure?",
      answer:
        "Absolutely! We use bank-level 256-bit SSL encryption and never store your banking passwords. We only read subscription-related emails and receipts with your permission.",
    },
    {
      question: "Can I share SubFlow with my team?",
      answer:
        "Yes! Our Team/Workspace Controls feature allows you to invite team members, set permissions, and collaborate on subscription management across your organization.",
    },
    {
      question: "Do you offer a free plan?",
      answer:
        "Yes! Our Starter plan is free forever and lets you track up to 10 subscriptions with basic features. Perfect for individuals just getting started.",
    },
    {
      question: "How is SubFlow different from other tools?",
      answer:
        "We're built by Pakistani entrepreneurs who understand startup challenges. Our focus is on practical features that save money, not complex enterprise features you don't need.",
    },
    {
      question: "Can I export my data?",
      answer:
        "Absolutely! Our Reports & Exports feature lets you export your subscription data in CSV, PDF, or Excel formats. You own your data completely.",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="chip mb-6">Get In Touch</div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Let's Start Your{" "}
              <span className="heading-gradient">Subscription</span> Journey
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Ready to take control of your subscriptions? Our team is here to
              help you get started and answer any questions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Multiple Ways to{" "}
              <span className="heading-gradient">Reach Us</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose the method that works best for you. We're always here to
              help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="card-glass p-8 text-center group hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-6 text-purple-400 group-hover:bg-purple-600/30 group-hover:scale-110 transition-all duration-300">
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {method.title}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {method.description}
                </p>
                {method.action ? (
                  <a
                    href={method.action}
                    target="_blank"
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
                  >
                    {method.contact}
                  </a>
                ) : (
                  <p className="text-purple-400 font-semibold">
                    {method.contact}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Break - Team Image */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-16">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
              alt="Pakistani startup team collaboration"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute left-8 bottom-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                Built by Pakistani Entrepreneurs
              </h3>
              <p className="text-gray-200 text-lg">
                Three founders who understand your subscription management
                struggles
              </p>
            </div>

            {/* Floating achievement card */}
            <div className="absolute -top-6 -right-6 bg-purple-600 rounded-2xl p-6 shadow-2xl z-10">
              <div className="text-2xl font-bold text-white mb-1">24hrs</div>
              <div className="text-purple-200 text-sm">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left - Contact Form */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Send Us a <span className="heading-gradient">Message</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Have questions about SubFlow? Want to see a demo? Or just want
                to say hello? We'd love to hear from you.
              </p>

              <form
                onSubmit={handleSubmit}
                className="card-glass p-8 space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-white font-medium mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-white font-medium mb-2"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      placeholder="Your company (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-white font-medium mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-white font-medium mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  >
                    <option value="">Select a topic</option>
                    <option value="demo">Request a Demo</option>
                    <option value="pricing">Pricing Questions</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-white font-medium mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                    placeholder="Tell us more about how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gradient text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <p className="text-gray-400 text-sm text-center">
                  We typically respond within 24 hours during business days.
                </p>
              </form>
            </div>

            {/* Right - Additional Info */}
            <div>
              <div className="mb-12">
                <h3 className="text-3xl font-bold text-white mb-6">
                  Why Choose SubFlow?
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">
                        Built by Entrepreneurs
                      </h4>
                      <p className="text-gray-400">
                        Created by Pakistani startup founders who understand
                        your challenges.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">
                        Save Real Money
                      </h4>
                      <p className="text-gray-400">
                        Our users typically save $200+ monthly by optimizing
                        their subscriptions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">
                        Personal Support
                      </h4>
                      <p className="text-gray-400">
                        Small team means personal attention. We actually care
                        about your success.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office/Workspace Image */}
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-8">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"
                  alt="Modern workspace setup"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold text-lg">
                        Remote-First Team
                      </h4>
                      <p className="text-gray-200 text-sm">
                        Working across Pakistan to serve you better
                      </p>
                    </div>
                    <div className="bg-green-500/20 backdrop-blur-lg border border-green-500/30 rounded-lg px-3 py-1">
                      <span className="text-green-400 text-sm font-medium">
                        Online Now
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="card-glass p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Quick Answers
                </h3>
                <div className="space-y-4">
                  {faqItems.slice(0, 3).map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-white font-semibold py-2 hover:text-purple-400 transition-colors">
                        {faq.question}
                        <svg
                          className="w-5 h-5 transition-transform group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <p className="text-gray-400 mt-2 pb-4 leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Frequently Asked{" "}
              <span className="heading-gradient">Questions</span>
            </h2>
            <p className="text-xl text-gray-400">
              Common questions from entrepreneurs and startups like yours
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <details
                key={index}
                className="card-glass p-6 group hover:border-purple-500/30 transition-all duration-300"
              >
                <summary className="flex items-center justify-between cursor-pointer text-white font-semibold text-lg hover:text-purple-400 transition-colors">
                  {faq.question}
                  <svg
                    className="w-6 h-6 transition-transform group-open:rotate-180 flex-shrink-0 ml-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="text-gray-400 mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of Pakistani entrepreneurs and startups who trust
            SubFlow to manage their subscriptions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services" className="btn-gradient text-lg">
              Start Free Trial - No Credit Card Required
            </Link>
            <Link href="/about" className="btn-ghost text-lg">
              Learn About Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}