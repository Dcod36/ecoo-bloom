import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const sustainabilityCards = [
    {
        icon: '♻️',
        title: 'Reduce & Recycle',
        description: 'Join our mission to reduce waste by 50% through community-driven recycling programs.',
        color: 'from-green-500 to-emerald-600',
        bgImage: '/card-recycle.png'
    },
    {
        icon: '🌍',
        title: 'Track Your Impact',
        description: 'Monitor your environmental footprint and see the real difference you\'re making.',
        color: 'from-blue-500 to-cyan-600',
        bgImage: '/card-sustainability.png'
    },
    {
        icon: '📍',
        title: 'Map Waste Hotspots',
        description: 'Identify and report areas with high garbage accumulation for targeted cleanup.',
        color: 'from-amber-500 to-orange-600',
        bgImage: '/card-map.png'
    },
    {
        icon: '🤝',
        title: 'Community Action',
        description: 'Connect with volunteers and participate in local cleanup drives.',
        color: 'from-purple-500 to-indigo-600',
        bgImage: '/card-sustainability.png'
    },
    {
        icon: '📊',
        title: 'AI-Powered Analysis',
        description: 'Get intelligent insights on waste patterns and optimize cleanup strategies.',
        color: 'from-pink-500 to-rose-600',
        bgImage: '/card-ai.png'
    },
    {
        icon: '🌱',
        title: 'Sustainable Future',
        description: 'Every action counts towards building a cleaner, greener planet for generations.',
        color: 'from-teal-500 to-green-600',
        bgImage: '/card-recycle.png'
    }
];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <>
            <Navbar />

            {/* Hero Section with Background */}
            <div
                className="min-h-screen flex items-center justify-center py-12 px-4 relative"
                style={{
                    backgroundImage: 'url(/login-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80"></div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="relative z-10 max-w-md w-full bg-slate-800/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-slate-700/50"
                >
                    <div className="text-center mb-6">
                        <span className="text-5xl">🌿</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">Welcome Back</h2>
                    <p className="text-center text-slate-400 mb-8 font-medium">Sign in to continue your eco journey</p>

                    {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-center mb-6 text-sm font-semibold border border-red-500/30">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900/50 text-white placeholder-slate-500 focus:bg-slate-900/80 focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all outline-none hover:border-slate-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900/50 text-white placeholder-slate-500 focus:bg-slate-900/80 focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all outline-none hover:border-slate-500"
                            />
                        </div>
                        <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-cyan-500 hover:shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] transition-all duration-300 mt-2">
                            Login
                        </button>
                    </form>
                    <p className="text-center text-slate-400 mt-8 text-sm">
                        Don't have an account? <Link to="/signup" className="text-green-400 font-bold hover:text-green-300 hover:underline">Sign Up</Link>
                    </p>
                </motion.div>
            </div>

            {/* Sustainability Cards Section */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 py-20 px-4">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                            Why <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">EcoBloom</span>?
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Join thousands of eco-warriors making a real difference in waste management and sustainability.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sustainabilityCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="relative rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-all duration-300 group h-64"
                                style={{
                                    backgroundImage: `url(${card.bgImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* Dark overlay for readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40 group-hover:from-slate-900/95 transition-all duration-300"></div>

                                {/* Content */}
                                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {card.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{card.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-16"
                    >
                        <p className="text-slate-400 mb-6 text-lg">Ready to make a difference?</p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            🌱 Start Your Journey
                        </Link>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Login;
