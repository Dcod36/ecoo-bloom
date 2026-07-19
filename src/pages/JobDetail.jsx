import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// ── Main JobDetail Page ────────────────────────────────────────────────────────
const JobDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [myAppStatus, setMyAppStatus] = useState(null); // null = not applied
    const [applying, setApplying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axios.get(`/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error("Error", error);
            }
        };
        const fetchMyApplications = async () => {
            try {
                const { data } = await axios.get('/applications/my');
                const match = data.find(app => app.job?._id === id || app.job === id);
                if (match) setMyAppStatus(match.status);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };
        fetchJob();
        fetchMyApplications();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!user.profileCompleted) {
            alert('Please complete your profile from the dashboard before applying.');
            return;
        }

        setApplying(true);
        try {
            await axios.post(`/applications/${job._id}`);
            setMyAppStatus('applied');
            setJob(prev => ({ ...prev, remainingSlots: prev.remainingSlots - 1 }));
        } catch (error) {
            console.error("Error applying:", error);
            alert(error.response?.data?.message || 'Failed to apply');
        }
        setApplying(false);
    };

    if (!job) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <BackButton />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 max-w-5xl mx-auto mt-6"
                >
                    <div className="border-b border-gray-100 pb-8 mb-8">
                        <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm uppercase tracking-wider mb-4">{job.status}</span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 leading-tight">{job.title}</h1>
                        <p className="text-xl text-text-muted font-medium flex items-center gap-2">
                            <span>📍</span> {job.location} <span className="mx-2">•</span> <span>📅</span> {job.date}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-text-main mb-4">About the Mission</h3>
                                <p className="text-lg text-text-muted leading-relaxed whitespace-pre-wrap">
                                    {job.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">TIME</div>
                                    <div className="text-lg font-bold text-text-main">{job.startTime} - {job.endTime}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">COMPENSATION</div>
                                    <div className="text-lg font-bold text-primary">₹{job.paymentAmount}</div>
                                </div>
                            </div>

                            {/* Info note about required documents */}
                            <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-800">
                                <span className="text-xl flex-shrink-0">📋</span>
                                <div>
                                    <p className="font-bold mb-0.5">Application Requirements</p>
                                    <p className="font-medium text-blue-700">You will need to provide personal details and upload a government-issued ID (Aadhaar, Passport, Driving Licence, or Voter ID) to apply.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-3xl h-fit border border-green-100">
                            <h3 className="text-xl font-bold text-text-main mb-6">Volunteer Status</h3>
                            <div className="mb-8 text-center">
                                <div className="text-6xl font-extrabold text-primary mb-2">
                                    {job.remainingSlots}
                                </div>
                                <div className="text-text-muted font-medium text-sm uppercase tracking-wide">spots remaining out of {job.totalSlots}</div>
                            </div>

                            {myAppStatus ? (
                                <div className="w-full py-4 rounded-xl text-center font-bold text-lg border-2"
                                    style={{
                                        background: myAppStatus === 'applied' ? '#eff6ff' : myAppStatus === 'admitted' ? '#f0fdf4' : '#faf5ff',
                                        borderColor: myAppStatus === 'applied' ? '#bfdbfe' : myAppStatus === 'admitted' ? '#bbf7d0' : '#e9d5ff',
                                        color: myAppStatus === 'applied' ? '#1d4ed8' : myAppStatus === 'admitted' ? '#15803d' : '#7e22ce',
                                    }}
                                >
                                    {myAppStatus === 'applied' && '📝 Application Submitted'}
                                    {myAppStatus === 'admitted' && '✅ You\'re Admitted!'}
                                    {myAppStatus === 'paid' && '💰 Payment Released'}
                                    {!['applied','admitted','paid'].includes(myAppStatus) && `Status: ${myAppStatus}`}
                                </div>
                            ) : job.remainingSlots > 0 ? (
                                <button
                                    id="apply-now-btn"
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {applying ? 'Applying...' : 'Apply Now'}
                                </button>
                            ) : (
                                <button disabled className="w-full py-4 rounded-xl border-2 border-gray-200 text-gray-400 font-bold text-lg cursor-not-allowed">
                                    Positions Full
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

        </>
    );
};

export default JobDetail;
