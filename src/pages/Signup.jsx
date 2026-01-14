import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-mesh">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-md w-full bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-slate-700/50"
                >
                    <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">Join EcoBloom</h2>
                    <p className="text-center text-slate-400 mb-8 font-medium">Start your journey today</p>

                    {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-center mb-6 text-sm font-semibold border border-red-500/30">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900/50 text-white placeholder-slate-500 focus:bg-slate-900/80 focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all outline-none hover:border-slate-500"
                            />
                        </div>
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
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-300 ml-1">I am a...</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-900/50 text-white focus:bg-slate-900/80 focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all outline-none cursor-pointer hover:border-slate-500"
                            >
                                <option value="user">Volunteer</option>
                                <option value="admin">Organizer (NGO/Admin)</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-cyan-500 hover:shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] transition-all duration-300 mt-2">
                            Sign Up
                        </button>
                    </form>
                    <p className="text-center text-slate-400 mt-8 text-sm">
                        Already have an account? <Link to="/login" className="text-green-400 font-bold hover:text-green-300 hover:underline">Login</Link>
                    </p>
                </motion.div>
            </div>
        </>
    );
};

export default Signup;
