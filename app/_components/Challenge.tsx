import { Card } from "@/components/ui/card";
import { AlertTriangle, Clock, FileText, Users, Zap, MapPin } from "lucide-react";
import React from 'react'

function Challenge() {
    const challenges = [
        {
            icon: FileText,
            title: "Siloed Data Sources",
            description: "Critical information scattered across spreadsheets, manual logbooks, and WhatsApp updates"
        },
        {
            icon: Clock,
            title: "Time-Compressed Decisions",
            description: "Supervisors have only 2 hours (21:00–23:00 IST) to reconcile complex interdependent variables"
        },
        {
            icon: AlertTriangle,
            title: "Error-Prone Process",
            description: "Manual reconciliation leads to missed clearances, unscheduled withdrawals, and KPI erosion"
        },
        {
            icon: Users,
            title: "Non-Scalable Workflow",
            description: "Current process cannot handle fleet growth from 25 to 40 trainsets by 2027"
        },
        {
            icon: Zap,
            title: "Hidden Costs",
            description: "Excessive night shunting increases energy consumption and poses safety risks"
        },
        {
            icon: MapPin,
            title: "Visibility Gaps",
            description: "Inadequate oversight of branding priorities risks advertiser SLA breaches"
        }
    ];

    return (
        <section className="py-10 bg-gradient-subtle " id="challenge">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-8 mt-1">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        The Challenge
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Every night, KMRL faces a complex optimization puzzle: deploying 25 four-car trainsets
                        across service, standby, and maintenance while managing six interdependent variables
                    </p>
                </div>

                {/* Problem Areas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {challenges.map((challenge, index) => (
                        <Card key={index} className="p-6 hover:shadow-medium transition-all duration-normal group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                                    <challenge.icon className="w-6 h-6 text-destructive" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-3 text-foreground">
                                        {challenge.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {challenge.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Impact Statistics */}
                <div className="mt-6 bg-destructive/5 rounded-2xl p-5">
                    <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
                        Current Impact on Operations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-destructive mb-2">↓ 99.5%</div>
                            <div className="text-sm font-medium text-muted-foreground">
                                Punctuality KPI at Risk
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-destructive mb-2">↑ Costs</div>
                            <div className="text-sm font-medium text-muted-foreground">
                                Uneven Mileage Assignment
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-destructive mb-2">⚠️ SLA</div>
                            <div className="text-sm font-medium text-muted-foreground">
                                Advertiser Penalties Risk
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Challenge