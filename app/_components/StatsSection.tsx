import Image from 'next/image';
import React from 'react'
import heroImage from '@/app/_assets/heroImage.png'

function StatsSection() {
   const stats = [
    {
      number: '87%',
      label: 'Reduction in Wait Times',
      description: 'Average wait reduced from 8.5 to 1.1 minutes'
    },
    {
      number: '₹18L',
      label: 'Monthly Energy Savings',
      description: 'Optimized schedules cut operational costs'
    },
    {
      number: '95%',
      label: 'Prediction Accuracy',
      description: 'Our AI correctly predicts crowd patterns'
    },
    {
      number: '12K+',
      label: 'Daily Commuters Impacted',
      description: 'Across Aluva, Edappally, and MG Road stations'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#0078B4] to-[#00A651] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src={heroImage}
          alt="Railway tracks background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Proven Results
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Real impact delivered across Kochi Metro operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {stat.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {stat.label}
                </h3>
                <p className="text-white/80 text-sm">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection