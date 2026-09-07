import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileModal from '../components/UserProfileModal';

const API_BASE = 'http://localhost:5000';

const getStatusBadge = (status) => {
    const styles = {
        applied: 'bg-blue-100 text-blue-700',
        admitted: 'bg-green-100 text-green-700',
        paid: 'bg-purple-100 text-purple-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
};

// ── Reward Points Panel ────────────────────────────────────────────────────────
const RewardPointsPanel = ({ app, onAdjust }) => {
    const [customPoints, setCustomPoints] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', msg }

    const handleAdjust = async (points, reason) => {
        setLoading(true);
        setFeedback(null);
        try {
            const res = await onAdjust(app._id, points, reason);
            setFeedback({ type: 'success', msg: res.message });
            setCustomPoints('');
        } catch (err) {
            setFeedback({ type: 'error', msg: err.response?.data?.message || 'Failed to adjust points' });
        }
        setLoading(false);
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleCustom = () => {
        const pts = parseInt(customPoints, 10);
        if (isNaN(pts) || pts === 0) return;
        handleAdjust(pts, pts > 0 ? 'Custom reward' : 'Custom deduction');
    };

    return (
        <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wider">⭐ Reward Points</p>
            <div className="flex flex-wrap gap-2 mb-2">
                <button
                    onClick={() => handleAdjust(20, 'Completed job')}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 disabled:opacity-50 transition-all flex items-center gap-1"
                >
                    ✅ +20 Completed
                </button>
                <button
                    onClick={() => handleAdjust(-10, 'No show')}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-50 transition-all flex items-center gap-1"
                >
                    ❌ -10 No Show
                </button>
            </div>
            <div className="flex gap-2">
                <input
                    type="number"
                    value={customPoints}
                    onChange={e => setCustomPoints(e.target.value)}
                    placeholder="Custom pts (e.g. +15 or -5)"
                    className="flex-1 px-2 py-1.5 text-xs border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                />
                <button
                    onClick={handleCustom}
                    disabled={loading || !customPoints}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 disabled:opacity-40 transition-all"
                >
                    Apply
                </button>
            </div>
            <AnimatePresence>
                {feedback && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mt-2 text-xs font-semibold ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {feedback.type === 'success' ? '✅' : '❌'} {feedback.msg}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Main JobApplications Page ──────────────────────────────────────────────────
const JobApplications = () => {
    const { id } = useParams();
    const [apps, setApps] = useState([]);
    const [job, setJob] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [expandedReward, setExpandedReward] = useState(null); // appId with open reward panel
    const navigate = useNavigate();
    const pollRef = useRef(null);

    const fetchData = async () => {
        try {
            const jobRes = await axios.get(`/jobs/${id}`);
            setJob(jobRes.data);
            const appsRes = await axios.get(`/applications/job/${id}`);
            setApps(appsRes.data);
        } catch (error) {
            console.error("Error", error);
        }
    };

    useEffect(() => {
        fetchData();

        // Poll every 10 seconds so new applicants appear live
        pollRef.current = setInterval(fetchData, 10000);
        return () => clearInterval(pollRef.current);
    }, [id]);

    const handleAdmit = async (appId) => {
        try {
            await axios.put(`/applications/${appId}/admit`);
            setApps(apps.map(a => a._id === appId ? { ...a, status: 'admitted' } : a));
            setSelectedApp(prev => prev?._id === appId ? { ...prev, status: 'admitted' } : prev);
        } catch (error) {
            alert("Error admitting volunteer");
        }
    };

    const handlePay = async (appId) => {
        try {
            await axios.patch(`/applications/${appId}/pay`);
            setApps(apps.map(a => a._id === appId ? { ...a, status: 'paid' } : a));
            setSelectedApp(prev => prev?._id === appId ? { ...prev, status: 'paid' } : prev);
        } catch (error) {
            alert("Error processing payment");
        }
    };

    const handleAdjustPoints = async (appId, points, reason) => {
        const res = await axios.patch(`/applications/${appId}/points`, { points, reason });
        return res.data;
    };

    const markCompleted = async () => {
        try {
            await axios.put(`/jobs/${id}/complete`);
            alert("Job Marked Completed!");
            navigate('/admin');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <BackButton />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Manage Volunteers</h2>
                            {job && <p className="text-gray-600 font-medium">For: <span className="text-gray-900">{job.title}</span></p>}
                        </div>
                        {job && job.status === 'open' && (
                            <button onClick={markCompleted} className="px-5 py-2 rounded-full border-2 border-green-500/30 text-green-600 font-bold hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300">
                                Mark Job as Completed
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Volunteer</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID Doc</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {apps.map(app => (
                                        <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-900 align-top">{app.user.name}</td>
                                            <td className="px-6 py-4 text-gray-600 text-sm align-top">{app.user.email}</td>
                                            <td className="px-6 py-4 align-top">
                                                {app.user.idDocumentUrl ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                                        🪪 Uploaded
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                                                        ⚠ Missing
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setSelectedApp(app)}
                                                            className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold hover:bg-blue-200 transition-all"
                                                        >
                                                            👁 Profile
                                                        </button>
                                                        {app.status === 'applied' && (
                                                            <button
                                                                onClick={() => handleAdmit(app._id)}
                                                                className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 shadow-sm transition-all"
                                                            >
                                                                ✅ Admit
                                                            </button>
                                                        )}
                                                        {app.status === 'admitted' && (
                                                            <button
                                                                onClick={() => handlePay(app._id)}
                                                                className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-bold hover:bg-purple-600 shadow-sm transition-all"
                                                            >
                                                                💰 Pay
                                                            </button>
                                                        )}
                                                        {/* Show reward toggle for admitted or paid volunteers */}
                                                        {(app.status === 'admitted' || app.status === 'paid') && (
                                                            <button
                                                                onClick={() => setExpandedReward(expandedReward === app._id ? null : app._id)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${expandedReward === app._id ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                                                            >
                                                                ⭐ Points
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Reward Points Panel — expands inline */}
                                                    <AnimatePresence>
                                                        {expandedReward === app._id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="w-full overflow-hidden"
                                                            >
                                                                <RewardPointsPanel
                                                                    app={app}
                                                                    onAdjust={handleAdjustPoints}
                                                                />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {apps.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                                                No applications yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>

            <UserProfileModal
                userId={selectedApp?.user?._id}
                isOpen={!!selectedApp}
                onClose={() => setSelectedApp(null)}
            />
        </>
    );
};

export default JobApplications;
