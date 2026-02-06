import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! We will contact you shortly.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };
  return (
    <Layout>
      <div className="bg-brand-black py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-brand-gray max-w-3xl mx-auto">
              Have questions about our services or products? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="p-8">
                <h3 className="text-xl font-bold text-white mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-yellow/10 rounded-lg flex items-center justify-center text-brand-yellow flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-gray mb-1">Call Us</p>
                      <p className="font-bold text-white text-lg">
                        011-2345678
                      </p>
                      <p className="text-xs text-brand-gray">
                        Mon-Sat: 8:30 AM - 6:00 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 flex-shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-gray mb-1">WhatsApp</p>
                      <p className="font-bold text-white text-lg">
                        077-1234567
                      </p>
                      <p className="text-xs text-brand-gray">Quick responses</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-gray mb-1">Email Us</p>
                      <p className="font-bold text-white text-lg">
                        info@anuratyres.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center text-brand-red flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-gray mb-1">
                        Head Office
                      </p>
                      <p className="font-bold text-white">
                        123 High Level Road,
                      </p>
                      <p className="text-white">Pannipitiya, Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Send us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Your Name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value
                      })
                      }
                      required />

                    <Input
                      label="Phone Number"
                      placeholder="077 123 4567"
                      value={formData.phone}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value
                      })
                      }
                      required />

                  </div>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value
                    })
                    }
                    required />

                  <div>
                    <label className="block text-sm font-medium text-brand-gray mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-brand-white placeholder-brand-gray/50 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:border-brand-yellow transition-all duration-200"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value
                      })
                      }
                      required />

                  </div>
                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>);

}