import { Check, DollarSign, Leaf, TrendingUp, Users, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import demo from '@/app/_assets/demo.png'
import crowd from '@/app/_assets/crowd.jpeg'

function BenefitsSection() {
    const benefits = [
    {
      icon: TrendingUp,
      title: 'Operational Efficiency',
      description: 'Optimize train frequencies and reduce operational waste',
      metrics: ['87% reduction in wait times', '30% better resource utilization', 'Real-time schedule adjustments']
    },
    {
      icon: DollarSign,
      title: 'Cost Savings',
      description: 'Significant reduction in operational and energy costs',
      metrics: ['₹18L+ monthly savings', '25% energy cost reduction', 'Lower maintenance overhead']
    },
    {
      icon: Users,
      title: 'Passenger Satisfaction',
      description: 'Enhanced commuter experience and service quality',
      metrics: ['Reduced overcrowding', 'Predictable schedules', '12K+ daily commuters served']
    },
    {
      icon: Leaf,
      title: 'Environmental Impact',
      description: 'Promote sustainable urban transportation',
      metrics: ['Reduced carbon footprint', 'Optimized energy usage', 'Encourage public transport']
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Transforming Metro Operations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the measurable impact of AI-driven scheduling on your metro system's performance and passenger satisfaction
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {benefits.map((benefit, index) => (
            <div key={index} className="group">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0078B4] to-[#00A651] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {benefit.description}
                  </p>
                  <ul className="space-y-2">
                    {benefit.metrics.map((metric, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-[#00A651] rounded-full"></div>
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Comparison */}
        <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Before vs After Implementation
          </h3>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Before */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={crowd}
                    alt="Crowded train before optimization"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold shadow-lg">
                  <X/>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Before AI Scheduling</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• 8.5 minute average wait times</li>
                <li>• Overcrowded peak hour trains</li>
                <li>• Empty trains during off-peak</li>
                <li>• High operational costs</li>
              </ul>
            </div>
            
            {/* After */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={demo}
                    alt="demo image"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold shadow-lg">
                  <Check/>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">After AI Scheduling</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• 1.1 minute average wait times</li>
                <li>• Balanced passenger distribution</li>
                <li>• Optimized train frequencies</li>
                <li>• 25% lower operational costs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection