import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { ShieldCheck, Users, Trophy, History } from 'lucide-react';
export function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <div className="relative bg-brand-dark py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-black" />

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Driven by Excellence
          </h1>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto leading-relaxed">
            Since 1995, Anura Tyres has been Sri Lanka's trusted partner for
            premium vehicle care, combining expert craftsmanship with
            world-class technology.
          </p>
        </div>
      </div>

      <div className="bg-brand-black py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-yellow">
                <History className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">43+ Years</h3>
              <p className="text-brand-gray text-sm">
                Decades of experience serving Sri Lankan motorists with
                integrity.
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-red">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Quality First
              </h3>
              <p className="text-brand-gray text-sm">
                Authorized dealer for world-renowned tyre and part brands.
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Expert Team</h3>
              <p className="text-brand-gray text-sm">
                Highly trained technicians certified in modern automotive
                systems.
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Award Winning
              </h3>
              <p className="text-brand-gray text-sm">
                Recognized for excellence in customer service and technical
                standards.
              </p>
            </Card>
          </div>

          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Our Journey
              </h2>
              <div className="space-y-6 text-brand-gray leading-relaxed">
                <p>
                  Anura Tyres Pvt Ltd was found in the year 1983 as an authorized tyres dealer for many brands of tyres, tubes, flaps & batteries. Almost all the importers of various brands of tyres and batteries appointed us to promote and sell their products due to our efficient marketing strategy.

                </p>
                <p>
                  Building upon this strong foundation, we launched Tyre Station Private Limited in 2017, further solidifying our presence in the market. Through our innovative strategies and relentless pursuit of excellence, the business achieved new milestones, culminating in the international expansion of NuTyre Private Limited in the UK. This venture reflects our commitment to providing premium solutions on a global scale, ensuring our reputation as leaders in the tyre industry continues to thrive.

                </p>
                <p>
                  It was started with a little group of young tyre enthusiasts & a highly efficient team of marketing staff, Anura Tyres started with a highly reference able client base. Among the attributes that has enabled Anura tyres to reach the top were, Vision, Integrity, Professionalism & Service standards etc. The company has grown substantially in the recent past by promoting high quality brands to our customers & providing excellent after sales services.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-yellow transform rotate-3 rounded-2xl opacity-20" />
              <img
                src="./hero-bg.png"
                alt="Workshop"
                className="relative rounded-2xl shadow-2xl border border-white/10" />

            </div>
          </div>
        </div>
      </div>
    </Layout>);

}