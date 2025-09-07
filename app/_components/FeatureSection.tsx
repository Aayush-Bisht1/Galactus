import { Brain, Shield, Clock, Users, Database, BarChart } from 'lucide-react';
import Image from 'next/image';
import dashboard from '@/app/_assets/dashboard.jpg'

export function FeaturesSection() {
  const features = [
    {
      icon: Database,
      title: "Real-Time Data Ingestion",
      description: "Integrate data from diverse sources including train sensors, maintenance logs, and scheduling systems to provide a unified view of operations."
    },
    {
      icon: Brain,
      title: "Intelligent Optimization",
      description: "Multi-objective algorithms balance service readiness, reliability, cost, and branding exposur"
    },
    {
      icon: BarChart,
      title: "Predictive Analytics",
      description: "Machine learning feedback loops improve forecast accuracy and decision quality over time"
    },
    {
      icon: Shield,
      title: "Compliance & Auditing",
      description: "Generate auditable decisions with explainable reasoning and comprehensive conflict alerts"
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
    <section id='features' className="pt-24 pb-20 bg-gray-50">
      <div className="w-full mx-auto px-20">
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
                src={dashboard}
                alt="Metro control room technology"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Stats */}
            <div className="absolute -top-7 -left-12 bg-white rounded-2xl p-3 shadow-lg">
              <div className="text-2xl font-bold text-[#0078B4]">87%</div>
              <div className="text-sm text-gray-600">Wait Time Reduction</div>
            </div>
            <div className="absolute -bottom-8 -right-10 bg-white rounded-2xl p-3 shadow-lg">
              <div className="text-2xl font-bold text-[#00A651]">₹18L+</div>
              <div className="text-sm text-gray-600">Monthly Savings</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}