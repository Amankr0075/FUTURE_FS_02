import { Link } from 'react-router-dom';
import { Zap, Users, PieChart, Shield, ArrowRight, Activity, TrendingUp } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 group">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">LeadFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
          <a href="#benefits" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Benefits</a>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/10 transition-all hover:scale-105 active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            The Modern CRM Experience
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight mb-8 leading-tight">
            Close More Deals.<br />
            <span className="bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">With Less Effort.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            LeadFlow CRM transforms how you manage prospects. Streamline your sales pipeline, gain actionable insights, and build better relationships—all in one beautiful workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-lg hover:from-indigo-600 hover:to-violet-700 transition-all duration-300 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 group">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
              Sign In to Account
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-24 max-w-5xl mx-auto relative group perspective">
          {/* Main Glow Behind the Mockup */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-violet-500/30 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none" />
          
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-2 shadow-2xl transform transition-all duration-700 hover:rotate-0 hover:scale-[1.02] rotate-x-12 scale-100 hover:shadow-indigo-500/25">
             <div className="rounded-xl border border-white/5 bg-slate-950 overflow-hidden shadow-2xl relative group-hover:border-indigo-500/30 transition-colors duration-500">
                {/* Fake browser header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5 backdrop-blur-md">
                   <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                   <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
                
                {/* The Mockup Image */}
                <div className="relative">
                  <img 
                    src={`${import.meta.env.BASE_URL}hero-mockup.png`} 
                    alt="LeadFlow CRM Dashboard Interface" 
                    className="w-full h-auto object-cover opacity-80 mix-blend-screen group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-700"
                  />
                  
                  {/* Decorative Scanline/Glow over the image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-violet-500/10 pointer-events-none mix-blend-overlay opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Features & Benefits Section */}
      <section id="features" className="container mx-auto px-6 py-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to succeed</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Powerful features designed to remove friction from your sales process and let you focus on what matters most: your customers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard 
            icon={Users}
            title="Intelligent Lead Management"
            description="Centralize your contacts. Track every interaction, set reminders, and never let a prospect slip through the cracks again."
          />
          <FeatureCard 
            icon={Activity}
            title="Real-time Pipeline"
            description="Visualize your sales process. Drag and drop leads through custom stages and instantly see where your revenue stands."
          />
          <FeatureCard 
            icon={PieChart}
            title="Actionable Analytics"
            description="Turn data into decisions. Beautiful dashboards provide insights into conversion rates, team performance, and growth trends."
          />
          <FeatureCard 
            icon={Zap}
            title="Lightning Fast"
            description="Built on modern architecture. Experience zero lag as you navigate between records, update statuses, and log calls."
          />
          <FeatureCard 
            icon={Shield}
            title="Enterprise Security"
            description="Your data is encrypted and secure. Granular permissions ensure team members only see what they need to."
          />
          <FeatureCard 
            icon={TrendingUp}
            title="Boosted Productivity"
            description="Automate repetitive tasks and focus on selling. LeadFlow helps you close deals 30% faster on average."
          />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-white/10 py-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to accelerate your growth?</h2>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 font-semibold text-lg hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-xl">
            Join LeadFlow Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
