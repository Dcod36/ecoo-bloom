import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import { motion } from 'framer-motion';

const JobApplications = () => {
    const { id } = useParams();
    const [apps, setApps] = useState([]);
    const [job, setJob] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
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
        fetchData();
    }, [id]);

    const handleAdmit = async (appId) => {
        try {
            const { data } = await axios.put(`/applications/${appId}/admit`);
            setApps(apps.map(a => a._id === appId ? { ...a, status: 'admitted' } : a));
        } catch (error) {
            alert("Error admitting volunteer");
        }
    };

    const handlePay = async (appId) => {
        try {
            await axios.patch(`/applications/${appId}/pay`);
            setApps(apps.map(a => a._id === appId ? { ...a, status: 'paid' } : a));
        } catch (error) {
            alert("Error processing payment");
        }
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

    const getStatusBadge = (status) => {
        const styles = {
            applied: 'bg-blue-100 text-blue-700',
            admitted: 'bg-green-100 text-green-700',
            paid: 'bg-purple-100 text-purple-700'
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
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
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reward Points</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {apps.map(app => (
                                        <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-gray-900">{app.user.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{app.user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                                                    ⭐ {app.user.rewardPoints || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    {app.status === 'applied' && (
                                                        <button
                                                            onClick={() => handleAdmit(app._id)}
                                                            className="px-4 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 shadow-md shadow-green-500/20 hover:shadow-lg transition-all"
                                                        >
                                                            ✅ Admit
                                                        </button>
                                                    )}
                                                    {app.status === 'admitted' && (
                                                        <button
                                                            onClick={() => handlePay(app._id)}
                                                            className="px-4 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-bold hover:bg-purple-600 shadow-md shadow-purple-500/20 hover:shadow-lg transition-all"
                                                        >
                                                            💰 Mark Paid (₹{job?.paymentAmount})
                                                        </button>
                                                    )}
                                                    {app.status === 'paid' && (
                                                        <span className="text-purple-600 font-bold flex items-center justify-end gap-1">💰 Paid ✓</span>
                                                    )}
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
        </>
    );
};

export default JobApplications;
