import React, { useState } from 'react';
import { api } from '../services/geminiService';

const PageTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
    <span className="text-gradient">{children}</span>
  </h2>
);

const InputField: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; rows?: number; required?: boolean }> = ({ id, label, type = 'text', rows, value, onChange, required }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
    {rows ? (
      <textarea id={id} name={id} rows={rows} value={value} onChange={onChange} required={required} className="w-full bg-slate-800/70 border border-slate-700 rounded-md p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
    ) : (
      <input type={type} id={id} name={id} value={value} onChange={onChange} required={required} className="w-full bg-slate-800/70 border border-slate-700 rounded-md p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
    )}
  </div>
);

export const ContactPage: React.FC<{showToast: (message: string, type: 'success' | 'error') => void}> = ({ showToast }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.submitContactForm(formData);
      showToast("Message sent successfully!", "success");
      setFormData({ name: '', email: '', message: '' });
    } catch {
      showToast("Failed to send message. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className="animate-fadeIn">
      <PageTitle>Contact Us</PageTitle>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900/50 border border-slate-800 p-8 rounded-lg">
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Get in Touch</h3>
            <p className="text-slate-400">
                Have a project in mind or just want to say hello? Fill out the form and we'll get back to you as soon as possible.
            </p>
            <div className="space-y-3 text-sm">
                <p className="flex items-center text-slate-300"><span className="text-blue-400 mr-2">Email:</span> contact@st-solutions.com</p>
                <p className="flex items-center text-slate-300"><span className="text-blue-400 mr-2">Phone:</span> +1 (234) 567-890</p>
            </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField id="name" label="Full Name" value={formData.name} onChange={handleChange} required />
          <InputField id="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />
          <InputField id="message" label="Your Message" rows={4} value={formData.message} onChange={handleChange} required />
          <button type="submit" disabled={isSubmitting} className="w-full text-base font-semibold text-white bg-blue-600 rounded-md px-8 py-3 transition-all duration-300 transform hover:scale-105 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:scale-100">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};