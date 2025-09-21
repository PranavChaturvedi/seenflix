"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Header } from "./components/Header";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-[#0d0c1d] text-white">
        <div className="aurora -z-20" />
        {/* mouse-trail gradient */}
         <MouseTrail />
        {/* parallax bg */}
        <motion.div style={{ y }} className="absolute inset-0 -z-10 opacity-20">
          <div className="aurora" />
        </motion.div>

        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400"
          >
            SeenFlix
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-4 max-w-2xl text-lg text-gray-300"
          >
            Showcase what you watched. Get roasted by friends. Discover what to
            binge next.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8"
          >
            <Link
              href="/manage"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-[#00f5d4] to-[#ff00a8] text-black font-bold
                         hover:scale-105 hover:shadow-[0_0_20px_#00f5d4,0_0_40px_#ff00a8] transition"
            >
              Get Started
            </Link>
          </motion.div>

          {/* floating stat card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 glass rounded-2xl p-6"
          >
            <StatCard />
          </motion.div>
          <NeonTickerInline />
        </section>
        {/* feature cards */}
        <section className="py-20 px-6">
          <FeatureCards />
        </section>
      </main>
    </>
  );
}

function MouseTrail() {
  return (
    <div
      onMouseMove={(e) => {
        document.documentElement.style.setProperty("--x", e.clientX + "px");
        document.documentElement.style.setProperty("--y", e.clientY + "px");
      }}
      className="pointer-events-none fixed inset-0 -z-20"
      style={{
        background: `radial-gradient(600px circle at var(--x) var(--y), rgba(0,245,212,0.15), transparent 80%)`,
      }}
    />
  );
}

function StatCard() {
  const count = useCountUp(847293);
  return (
    <div className="flex items-center gap-4">
      <span className="text-3xl font-bold">{count.toLocaleString()}</span>
      <span className="text-gray-400">movies & shows already tracked</span>
    </div>
  );
}

function useCountUp(end: number, duration = 2) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);
  return count;
}

function NeonTickerInline() {
  const titles = [
    "🎬 Inception", "📺 Breaking Bad", "🍿 Interstellar", "🎞️ Pulp Fiction",
    "🎥 The Dark Knight", "📽️ Parasite", "🎦 Avengers", "🎭 Joker",
    "🎬 Titanic", "📺 Stranger Things", "🍿 Avatar", "🎞️ Gladiator",
  ];
  const list = [...titles, ...titles];
  return (
    <div className="w-full mt-40 h-12 bg-black/20 backdrop-blur-sm border-y border-white/10 overflow-hidden">
      <div className="flex items-center h-full animate-marquee whitespace-nowrap">
        {list.map((t, i) => (
          <span key={i} className="mx-6 text-2xl text-cyan-300">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeatureCards() {
  const cards = [
    { title: "Track", desc: "Log everything you watch in one click." },
    { title: "Discover", desc: "AI-powered picks based on your taste." },
    { title: "Roast", desc: "Share your list & let friends judge." },
  ];
  return (
    <div className="grid mt-5 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-2">{c.title}</h3>
          <p className="text-gray-300">{c.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
