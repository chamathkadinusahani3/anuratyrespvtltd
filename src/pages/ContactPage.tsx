// FULL FILE — replace everything

import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import contact from '../assets/contactus.png';
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] =
    useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.name || !formState.email || !formState.phone || !formState.message) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'a45a9208-308b-4666-9986-1680119e9aac',
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          message: formState.message,
          subject: `New Contact Message from ${formState.name}`
        })
      });

      const data = await res.json();

      if (data.success) {
        setSubmitStatus('success');
        setFormState({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
<div className="relative bg-brand-dark py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-10"
    style={{ backgroundImage: `url(${contact})` }}
  />
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-black" />

  {/* Content */}
  <div className="relative max-w-7xl mx-auto text-center">
    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
      Get in Touch
    </h1>
    <p className="text-xl text-brand-gray max-w-3xl mx-auto leading-relaxed">
       Have questions about our services or products? We're here to help.
    </p>
  </div>
</div>
      <div className="bg-brand-black py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <Card className="p-8">
                <h3 className="text-xl font-bold text-white mb-6">
                  Contact Information
                </h3>

                <Info icon={<Phone />} title="Call Us">011-2345678</Info>
                <Info icon={<MessageCircle />} title="WhatsApp">077-1234567</Info>
                <Info icon={<Mail />} title="Email Us">info@anuratyres.com</Info>
                <Info icon={<MapPin />} title="Head Office">
                  123 High Level Road,<br />Pannipitiya, Sri Lanka
                </Info>
                {/* Map */}
            <div className="relative h-64 rounded-2xl overflow-hidden border border-yellow-400/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.392279957761!2d79.95565651141608!3d6.843486919331875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2518be381b7c5%3A0x4a941c17725b20!2sANURA%20Tyres%20(Pvt)%20Ltd!5e0!3m2!1sen!2slk!4v1770723957901!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
              </Card>
            </div>
            

            <div className="lg:col-span-2">
              
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Send us a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input label="Your Name *" name="name" value={formState.name} onChange={handleChange} />
                  <Input label="Phone Number *" name="phone" value={formState.phone} onChange={handleChange} />
                  <Input label="Email Address *" name="email" type="email" value={formState.email} onChange={handleChange} />

                  <div>
                    <label className="block text-sm font-medium text-brand-gray mb-1.5">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white"
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
              
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {submitStatus !== 'idle' && (
          <StatusModal
            status={submitStatus}
            onClose={() => setSubmitStatus('idle')}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}

function StatusModal({ status, onClose }: any) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-brand-dark p-8 rounded-2xl text-center max-w-md w-full relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        {status === 'success' ? (
          <>
            <CheckCircle className="mx-auto text-green-500 w-12 h-12 mb-4" />
            <h3 className="text-xl text-white font-bold">Message Sent!</h3>
            <p className="text-gray-300 mb-2">
                      Your message has been sent successfully.
                    </p>
                    <p className="text-gray-400 text-sm">
                      One of our call center operators will contact you shortly. Thank you!
                    </p>
          </>
        ) : (
          <>
            <AlertCircle className="mx-auto text-red-500 w-12 h-12 mb-4" />
            <h3 className="text-xl text-white font-bold">Something went wrong</h3>
            <p className="text-gray-400 mt-2">Please try again later.</p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function Info({ icon, title, children }: any) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-10 h-10 bg-brand-yellow/10 rounded-lg flex items-center justify-center text-brand-yellow">
        {icon}
      </div>
      <div>
        <p className="text-sm text-brand-gray mb-1">{title}</p>
        <p className="font-bold text-white">{children}</p>
      </div>
    </div>
  );
}