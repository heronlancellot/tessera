"use client";

import { Check, Target, Rocket, Sparkles } from "lucide-react";

const roadmapPhases = [
  {
    phase: "MVP",
    date: "Q4 2024",
    progress: "25%",
    status: "completed",
    icon: Check,
    items: [
      "Gateway with /preview and /fetch routes",
      "x402 payments on Avalanche",
      "TypeScript SDK & Dashboard",
      "Basic analytics & wallet integration",
    ],
  },
  {
    phase: "Publisher Expansion",
    date: "Q1 2025",
    progress: "50%",
    status: "current",
    icon: Target,
    items: [
      "5-10 real publishers",
      "NFT recurring access system",
      "Rate limiting & webhooks",
      "Mobile & Python SDKs",
    ],
  },
  {
    phase: "Advanced Features",
    date: "Q2 2026",
    progress: "75%",
    status: "upcoming",
    icon: Rocket,
    items: [
      "Paid search & subscription bundles",
      "Advanced analytics dashboard",
      "Multi-chain support (Polygon, Base)",
      "n8n integration (nodes & lib)",
    ],
  },
  {
    phase: "Ecosystem",
    date: "Q4 2026",
    progress: "100%",
    status: "upcoming",
    icon: Sparkles,
    items: [
      "Publisher marketplace",
      "AI-powered pricing",
      "Partnership program (20% referral)",
      "Enterprise features & white-label",
    ],
  },
];

export function LandingRoadmap() {
  return (
    <section className="relative px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center md:mb-20">
          <h2 className="mb-4 font-be-vietnam text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Roadmap
          </h2>
          <p className="mx-auto max-w-2xl font-be-vietnam text-base text-gray-400 sm:text-lg">
            Our journey to revolutionize premium content access for AI agents
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[20%] top-0 h-full w-0.5 bg-gradient-to-b from-green-500/60 via-purple-500/60 to-gray-500/40 md:left-1/2 md:-translate-x-1/2" />

          {/* Phases */}
          <div className="space-y-20 md:space-y-32">
            {roadmapPhases.map((phase, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div key={phase.phase} className="relative">
                  {/* Progress circle - SEMPRE na linha central */}
                  <div className="absolute left-[20%] top-0 z-10 -translate-x-1/2 md:left-1/2">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#141619] ${
                        phase.status === "completed"
                          ? "bg-green-500"
                          : phase.status === "current"
                            ? "bg-purple-500"
                            : "bg-gray-600"
                      }`}
                    >
                      <div className="font-be-vietnam text-sm font-bold text-white">
                        {phase.progress}
                      </div>
                    </div>
                  </div>

                  {/* Container para desktop com 3 colunas */}
                  <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-8">
                    {/* Date badge OU Content - esquerda */}
                    <div className={`${isLeft ? "flex justify-end" : ""}`}>
                      {isLeft ? (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1a1d2e] to-[#252941] shadow-lg">
                          <div className="text-center">
                            <div className="font-be-vietnam text-sm font-bold text-white">
                              {phase.date.split(" ")[0]}
                            </div>
                            <div className="font-be-vietnam text-xs text-gray-400">
                              {phase.date.split(" ")[1]}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <h3 className="mb-3 font-be-vietnam text-xl font-bold text-white md:text-2xl">
                            {phase.phase}
                          </h3>
                          <ul className="inline-block space-y-2 text-left">
                            {phase.items.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="flex items-start gap-2 font-be-vietnam text-sm text-gray-300"
                              >
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-400"></span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Espaço para bolinha (vazia porque a bolinha é absolute) */}
                    <div className="w-16"></div>

                    {/* Content OU Date badge - direita */}
                    <div>
                      {isLeft ? (
                        <div>
                          <h3 className="mb-3 font-be-vietnam text-xl font-bold text-white md:text-2xl">
                            {phase.phase}
                          </h3>
                          <ul className="space-y-2">
                            {phase.items.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="flex items-start gap-2 font-be-vietnam text-sm text-gray-300"
                              >
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-400"></span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1a1d2e] to-[#252941] shadow-lg">
                          <div className="text-center">
                            <div className="font-be-vietnam text-sm font-bold text-white">
                              {phase.date.split(" ")[0]}
                            </div>
                            <div className="font-be-vietnam text-xs text-gray-400">
                              {phase.date.split(" ")[1]}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile - layout simples */}
                  <div className="ml-[30%] md:hidden">
                    <h3 className="mb-3 font-be-vietnam text-xl font-bold text-white">
                      {phase.phase}
                    </h3>
                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start gap-2 font-be-vietnam text-sm text-gray-300"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-400"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
