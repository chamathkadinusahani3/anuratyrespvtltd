import { Trophy, ShieldCheck, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
export function ExcellenceSection() {
  const stats = [
  {
    icon: Trophy,
    value: '43+',
    label: 'Years Experience',
    desc: 'Decades of experience serving Sri Lankan motorists with integrity'
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Quality First',
    desc: 'Authorized dealer for world-renowned tyre and part brands'
  },
  {
    icon: Users,
    value: '50+',
    label: 'Expert Team',
    desc: 'Highly trained technicians certified in modern automotive systems'
  },
  {
    icon: Award,
    value: 'Top',
    label: 'Award Winning',
    desc: 'Recognized for excellence in customer service and technical standards'
  }];

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/5 select-none pointer-events-none">
        1983
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-4">

            Driven by <span className="text-brand-yellow">Excellence</span>
          </motion.h2>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.2
            }}
            className="text-gray-400 max-w-3xl mx-auto text-lg">

            Since 1983, Anura Tyres has been Sri Lanka's trusted partner for
            premium vehicle care, combining expert craftsmanship with
            world-class technology.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) =>
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 30
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: index * 0.1
            }}
            className="text-center group">

              <div className="w-16 h-16 mx-auto bg-brand-card border border-brand-border rounded-full flex items-center justify-center mb-6 group-hover:border-brand-yellow transition-colors duration-300 shadow-lg shadow-black/50">
                <stat.icon className="w-8 h-8 text-brand-yellow" />
              </div>
              <h3 className="text-4xl font-black text-white mb-2">
                {stat.value}
              </h3>
              <h4 className="text-lg font-bold text-brand-yellow mb-3">
                {stat.label}
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                {stat.desc}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}