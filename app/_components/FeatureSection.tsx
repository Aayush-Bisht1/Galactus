import { Brain, Zap, BarChart3, Shield, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import dash from '@/app/_assets/dashboard.jpg'

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'Predictive AI Engine',
      description: 'Advanced machine learning algorithms predict passenger demand patterns with 95% accuracy'
    },
    {
      icon: Zap,
      title: 'Real-time Optimization',
      description: 'Instantly adjusts train schedules based on live passenger data and external factors'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Comprehensive dashboards provide actionable insights for operational decisions'
    },
    {
      icon: Shield,
      title: 'Reliable & Secure',
      description: 'Enterprise-grade security with 99.9% uptime for critical metro operations'
    },
    {
      icon: Clock,
      title: 'Demand Forecasting',
      description: 'Predicts crowd patterns hours in advance for proactive schedule adjustments'
    },
    {
      icon: Users,
      title: 'Passenger Experience',
      description: 'Reduces wait times and overcrowding for a better commuter experience'
    }
  ];

  return (
    <section id='features' className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Intelligent Metro Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform transforms how metro systems operate, delivering smarter scheduling and better passenger experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0078B4] to-[#00A651] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Feature Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={dash}
                alt="Metro control room technology"
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-[#0078B4]">87%</div>
              <div className="text-sm text-gray-600">Wait Time Reduction</div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-lg">
              <div className="text-2xl font-bold text-[#00A651]">₹18L+</div>
              <div className="text-sm text-gray-600">Monthly Savings</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}