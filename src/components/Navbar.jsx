import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLeaf } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-black/20 transition-all duration-300">
            <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2 hover:scale-105 transition-transform">
                    <FaLeaf className="text-green-400" /> EcoBloom
                </Link>
                <div className="flex gap-6 items-center">
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <Link to="/admin" className="font-medium text-slate-300 hover:text-green-400 transition-colors">Dashboard</Link>
                            ) : (
                                <>
                                    <Link to="/dashboard" className="font-medium text-slate-300 hover:text-green-400 transition-colors">Jobs</Link>
                                    <Link to="/my-applications" className="font-medium text-slate-300 hover:text-green-400 transition-colors">My Applications</Link>
                                </>
                            )}
                            <button onClick={handleLogout} className="px-5 py-2 rounded-full border border-slate-600 text-slate-300 font-medium hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all duration-300 text-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="font-semibold text-slate-400 hover:text-green-400 transition-colors">Login</Link>
                            <Link to="/signup" className="px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
