import FadeIn from "@/components/animations/FadeIn";
import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";

import { Parallax } from "react-scroll-parallax";

import { VIDEOS } from "../features/video-generator/WhatWeCanGenerate";
import Marquee from "react-fast-marquee";
import SlideDown from "@/components/animations/SlideDown";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

const METRICS = [
  {
    label: "Cost per Stream",
    value: "0.056",
    unit: "$",
    change: "-8.3%",
    up: true,
    sub: "Lower is better",
    color: "#3A60E7",
    iconBg: "rgba(58,96,231,0.12)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <polyline
          points="22 12 18 12 15 21 9 3 6 12 2 12"
          stroke="#3A60E7"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    sparkData: [
      { d: "M", current: 0.082, prev: 0.095 },
      { d: "T", current: 0.078, prev: 0.091 },
      { d: "W", current: 0.074, prev: 0.088 },
      { d: "T", current: 0.069, prev: 0.084 },
      { d: "F", current: 0.065, prev: 0.081 },
      { d: "S", current: 0.06, prev: 0.078 },
      { d: "S", current: 0.056, prev: 0.075 },
    ],
  },
];
const Features = () => {
  return (
    <section className="py-20 lg:py-[120px] overflow-hidden bg-bg-card">
      <div className="container">
        <FadeInUp>
          <div className="text-center mb-16">
            <button className="sectionLabel mx-auto mb-3">Features</button>
            <h2 className="text-3xl lg:text-5xl mx-auto mb-6 max-w-[880px]">
              <TextAnimation text="All you need," />
              <span className="text-primary block">
                <TextAnimation text="in one platform" />
              </span>
            </h2>
            {/* <p className="md:text-lg">
							We built the tools music marketing agencies charge
							thousands for — and made them simple.
						</p> */}
          </div>
        </FadeInUp>
        <FadeInUp>
          <Parallax speed={5}>
            <FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 gap-y-20 lg:gap-y-[120px] lg:gap-x-20 mb-20 lg:mb-[120px]">
                <div className="card bg-white! flex flex-col">
                  <div>
                    <h3 className="text-xl md:text-3xl font-bold leading-[1.3]">
                      <TextAnimation text="Dashboard: your REAL cost per stream updated every minute" />
                    </h3>
                    <p className="text-sm text-muted mt-2 mb-6">
                      We show you the most important cost for your artist. Not
                      CPM, NOT CPC. The CPs (Cost per Stream)
                    </p>
                  </div>
                  {METRICS.map((m) => {
                    const chartColor = m.change.startsWith("-")
                      ? "#F43F5E"
                      : "#3A60E7";
                    const gradId = `grad-${m.label.replace(/\s+/g, "-")}`;
                    return (
                      <div
                        key={m.label}
                        style={{
                          background: "var(--bg-card)",
                          borderRadius: 20,
                          padding: "1.25rem",
                          border: "1px solid var(--border)",
                          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        {/* Icon + label */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                              fontWeight: 500,
                            }}
                          >
                            {m.label}
                          </p>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              background: m.iconBg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {m.icon}
                          </div>
                        </div>

                        {/* Value + change */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "0.5rem",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "1.75rem",
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              lineHeight: 1,
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {m.unit}
                            {m.value}
                          </p>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              padding: "0.15rem 0.45rem",
                              borderRadius: 99,
                              background: m.up
                                ? "rgba(18,183,106,0.12)"
                                : "rgba(244,63,94,0.12)",
                              color: m.up ? "#12B76A" : "#F43F5E",
                            }}
                          >
                            {m.change}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {m.sub}
                        </p>

                        {/* ── Sparkline chart ── */}
                        <div style={{ marginTop: "auto" }}>
                          <ResponsiveContainer width="100%" height={64}>
                            <AreaChart
                              data={m.sparkData}
                              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient
                                  id={gradId}
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor={chartColor}
                                    stopOpacity={0.22}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor={chartColor}
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <Tooltip
                                contentStyle={{
                                  background: "var(--bg-card)",
                                  border: "1px solid var(--border)",
                                  borderRadius: 8,
                                  fontSize: "0.72rem",
                                  color: "var(--text-primary)",
                                }}
                                itemStyle={{ color: chartColor }}
                                formatter={(val) => [`${m.unit}${val}`, ""]}
                                labelFormatter={() => ""}
                              />
                              <Area
                                type="monotone"
                                dataKey="prev"
                                stroke={chartColor}
                                strokeWidth={1}
                                strokeDasharray="3 3"
                                fill="none"
                                dot={false}
                                strokeOpacity={0.4}
                              />
                              <Area
                                type="monotone"
                                dataKey="current"
                                stroke={chartColor}
                                strokeWidth={2}
                                fill={`url(#${gradId})`}
                                dot={false}
                                activeDot={{
                                  r: 4,
                                  fill: chartColor,
                                  stroke: "var(--bg-card)",
                                  strokeWidth: 2,
                                }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>

                          {/* Legend */}
                          <div
                            style={{
                              display: "flex",
                              gap: "1rem",
                              marginTop: "0.375rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                              }}
                            >
                              <div
                                style={{
                                  width: 14,
                                  height: 2,
                                  background: chartColor,
                                  borderRadius: 1,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: "0.68rem",
                                  color: "var(--text-muted)",
                                }}
                              >
                                This period
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                              }}
                            >
                              <div
                                style={{
                                  width: 14,
                                  height: 2,
                                  background: chartColor,
                                  borderRadius: 1,
                                  opacity: 0.4,
                                  backgroundImage: `repeating-linear-gradient(to right, ${chartColor} 0, ${chartColor} 3px, transparent 3px, transparent 6px)`,
                                }}
                              />
                              <span
                                style={{
                                  fontSize: "0.68rem",
                                  color: "var(--text-muted)",
                                }}
                              >
                                Prev period
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col">
                  <div>
                    <h3 className="text-xl md:text-3xl font-bold leading-[1.3]">
                      <TextAnimation text="Campaigns: Launch winning campaigns with our secret strategy in just 60 seconds" />
                    </h3>
                    <p className="text-sm text-muted mt-2 mb-6">
                      After investing +200.000$ on ads we found a similarity
                      across all our campaigns, the structure. Now we give it to
                      you so you can start making winning campaigns at the best
                      costs
                    </p>
                  </div>
                  <img
                    src="/img/music-campaign.jpg"
                    alt=""
                    className="border border-border rounded w-full max-w-[370px] mt-auto"
                  />
                </div>
              </div>
            </FadeIn>
          </Parallax>
        </FadeInUp>
      </div>
      <FadeInUp>
        <Parallax speed={-5}>
          <div>
            <div className="max-w-[720px] mb-10 text-center mx-auto">
              <h3 className="text-xl md:text-3xl font-bold leading-[1.3]">
                <TextAnimation text="Create lyric ads within seconds" />
              </h3>
              <p className="text-muted mt-2">
                Stop editing videos for hours just to get no results on ads and
                200 views on tiktok. After creating more than 3.000 music ads,
                we found the best videos and we’ve added them to our template
                library so you can use it by just dragging your song. And yes,
                you will get this viral tiktok lyrics so you can go viral as
                well!
              </p>
            </div>
            <Marquee>
              {VIDEOS.map((s) => (
                <SlideDown key={s.id}>
                  <div className="relative rounded-[12px] overflow-hidden mr-6 border border-primary">
                    <video
                      src={s.url}
                      controls={false}
                      disablePictureInPicture
                      className="rounded-[10px] w-[300px] h-[533.33px] object-cover"
                      autoPlay
                      muted
                    />
                    <div className="absolute w-full left-0 bottom-0 p-3 py-5 bg-linear-to-t from-primary to-transparent">
                      <h3 className="mt-3 font-bold text-xl text-center text-white mb-2">
                        {s.name}
                      </h3>
                      <span className="text-center text-xs text-muted block">
                        this video has generated over {s.views} views
                      </span>
                    </div>
                  </div>
                </SlideDown>
              ))}
            </Marquee>
          </div>
        </Parallax>
      </FadeInUp>
    </section>
  );
};

export default Features;
