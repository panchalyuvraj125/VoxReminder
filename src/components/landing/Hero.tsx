import { ArrowUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import DashboardMockup from './DashboardMockup';

const BG_IMAGE = 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85';
const GRASS_IMAGE = 'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png';

export default function Hero() {
  return (
    <main className="bg-white">
      <section
        className="relative min-h-[100svh] overflow-hidden bg-cover bg-center flex flex-col"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      >
      {/* Navbar */}
      <Navbar />

      {/* Spacer */}
      <div className="flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-5 sm:px-8 flex flex-col items-center">
        {/* Headline */}
        <h1 className="text-gray-900 font-normal leading-[1.05] tracking-tight text-[40px] min-[400px]:text-[44px] sm:text-6xl lg:text-7xl xl:text-[80px]">
          <span className="block animate-fade-up">Remember everything.</span>
          <span className="block animate-fade-up" style={{ animationDelay: '100ms' }}>
            Effortlessly.
          </span>
        </h1>

        {/* Search Bar */}
        <form
          className="animate-fade-up mt-5 sm:mt-6 w-full max-w-xl"
          style={{ animationDelay: '220ms' }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-3 rounded-full bg-white/60 backdrop-blur-md ring-1 ring-gray-200 pl-5 pr-1.5 py-1.5">
            <input
              type="text"
              className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 outline-none py-2"
              placeholder="Remind me to drink water at 5:00 PM"
              readOnly
            />
            <button
              type="submit"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900 text-white hover:scale-105 active:scale-95 transition-transform shrink-0 flex items-center justify-center"
            >
              <ArrowUp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </form>

        {/* Description */}
        <p
          className="animate-fade-up mt-4 sm:mt-5 text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md"
          style={{ animationDelay: '340ms' }}
        >
          Speak your reminders, hear them back
          <br />
          — powered by your browser, no signup needed.{' '}
          <Sparkles className="inline w-4 h-4 -mt-1" />
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fade-up mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: '460ms' }}
        >
          <Link
            to="/app"
            className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 hover:shadow-lg transition-all"
          >
            Try It Free
          </Link>
          <a
            href="#how-it-works"
            className="text-gray-700 text-sm font-medium px-6 py-2.5 rounded-full ring-1 ring-gray-300 hover:bg-gray-100 transition-colors"
          >
            See How It Works
          </a>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1 min-h-10 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Dashboard Mockup */}
      <div
        className="animate-hero-rise relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-20 lg:-mb-32"
        style={{ animationDelay: '620ms' }}
      >
        <DashboardMockup />
      </div>

      {/* Grass Overlay */}
      <img
        src={GRASS_IMAGE}
        alt=""
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
        loading="eager"
      />
      </section>

      {/* --- New Landing Page Sections --- */}
      <section id="features" className="py-24 bg-[#121214] text-white relative z-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-12 text-center tracking-tight text-white/90">Key Features</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center text-xl ring-1 ring-white/10">🎤</div>
              <h3 className="font-semibold text-xl text-white/90">Voice Activated</h3>
              <p className="text-white/60 text-sm leading-relaxed">Just speak your mind. Our advanced natural language processing perfectly understands complex time formats.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center text-xl ring-1 ring-white/10">⚡</div>
              <h3 className="font-semibold text-xl text-white/90">Instant Feedback</h3>
              <p className="text-white/60 text-sm leading-relaxed">No waiting. Get immediate visual and audio confirmation that your reminder was successfully scheduled.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center text-xl ring-1 ring-white/10">🔒</div>
              <h3 className="font-semibold text-xl text-white/90">Privacy First</h3>
              <p className="text-white/60 text-sm leading-relaxed">Runs entirely in your browser. No signups, no data harvesting. Your reminders stay strictly on your device.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-[#1a1a1c] text-white relative z-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-12 tracking-tight text-white/90">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-6 left-[20%] right-[20%] h-0.5 bg-white/10" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#242427] ring-4 ring-[#1a1a1c] text-white font-bold rounded-full flex items-center justify-center text-xl shadow-sm border border-white/10 mb-6">1</div>
              <h3 className="font-semibold text-lg mb-2 text-white/90">Speak</h3>
              <p className="text-white/60 text-sm">Click the microphone and say "Remind me to call mom in 10 minutes".</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#242427] ring-4 ring-[#1a1a1c] text-white font-bold rounded-full flex items-center justify-center text-xl shadow-sm border border-white/10 mb-6">2</div>
              <h3 className="font-semibold text-lg mb-2 text-white/90">Relax</h3>
              <p className="text-white/60 text-sm">Close the tab or leave it open. The countdown begins instantly.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-600 ring-4 ring-[#1a1a1c] text-white font-bold rounded-full flex items-center justify-center text-xl shadow-md mb-6">3</div>
              <h3 className="font-semibold text-lg mb-2 text-white/90">Hear</h3>
              <p className="text-white/60 text-sm">When the time comes, a voice will automatically read your reminder aloud.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-[#121214] text-white relative z-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-6 tracking-tight text-white/90">About VoxRemind</h2>
          <p className="text-white/60 leading-relaxed text-lg">
            VoxRemind was built to solve a simple problem: setting reminders should take zero friction. 
            By combining modern Web Speech APIs with a sleek, distraction-free interface, we've created the fastest way to get thoughts out of your head and into a trusted system.
          </p>
          <p className="text-white/60 leading-relaxed text-lg">
            Whether you're cooking, studying, or just deep in focus mode, a quick voice command is all it takes to keep yourself on track.
          </p>
        </div>
      </section>

      <footer className="py-8 bg-[#1a1a1c] border-t border-white/5 text-center relative z-20">
        <p className="text-sm text-white/40">© {new Date().getFullYear()} VoxRemind. All rights reserved.</p>
      </footer>
    </main>
  );
}
