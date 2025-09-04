import React from 'react'
import { Database,Brain,BarChart,Shield} from "lucide-react";
import { Card } from "@/components/ui/card";
import solutionImage from '@/app/_assets/demo.png'
import Image from 'next/image'
const Description = () => {
  const solutions  = [
    {  icon:Database,
      title: "Real-Time Data Ingestion",
      description: "Integrate data from diverse sources including train sensors, maintenance logs, and scheduling systems to provide a unified view of operations."
    },
    {  icon:Brain,
      title: "Intelligent Optimization",
      description: "Multi-objective algorithms balance service readiness, reliability, cost, and branding exposur"
    },
    {
      icon:BarChart,
      title: "Predictive Analytics",
      description: "Machine learning feedback loops improve forecast accuracy and decision quality over time"
    },
    {
      icon:Shield,
      title: "Compliance & Auditing",
      description: "Generate auditable decisions with explainable reasoning and comprehensive conflict alerts"
    }
  ]
  return (
    <section className="py-10 bg-gradient-subtle" id='solution'>
      <div className="container mx-auto px-6">
         <div className="text-center mb-8 mt-1 flex md:flex-row flex-col gap-8 items-center justify-center">
          {/* {left section} */}
             <div className=" mb-8 mt-1">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                       The Solution
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Our Intelligent Fleet Management System is designed to revolutionize the way KMRL manages its train operations. By leveraging advanced data analytics and machine learning algorithms, 
                        our platform provides real-time insights and predictive capabilities to optimize train scheduling, enhance punctuality, and improve overall operational efficiency.
                         Key features include automated scheduling, real-time tracking, predictive maintenance alerts, and comprehensive reporting tools.
                          This system aims to reduce manual intervention, minimize delays, and ensure a seamless experience for both operators and passengers.  </p>     
            </div>
            {/* rightsection */}
            <div className='w-[50%]'>
               <Image src={solutionImage} alt="demo" />

            </div>

         </div> 
     <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
        {solutions.map((solution, index) => (
          <Card key={index} className="p-6 hover:shadow-medium transition-all duration-normal group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                                    <solution.icon className="w-6 h-6 text-destructive" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-3 text-foreground">
                                        {solution.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {solution.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
         
        ))}
       </div>

        
      </div>
       
    </section>
  )
}

export default Description