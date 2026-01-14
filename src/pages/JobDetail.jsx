import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import { motion } from 'framer-motion';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
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
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        try {
            await axios.post(`/applications/${id}`);
            alert("Application Successful!");
            navigate('/my-applications');
        } catch (error) {
            alert(error.response?.data?.message || "Failed to apply");
        }
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
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-3xl h-fit border border-green-100">
                            <h3 className="text-xl font-bold text-text-main mb-6">Volunteer Status</h3>
                            <div className="mb-8 text-center">
                                <div className="text-6xl font-extrabold text-primary mb-2">
                                    {job.remainingSlots}
                                </div>
                                <div className="text-text-muted font-medium text-sm uppercase tracking-wide">spots remaining out of {job.totalSlots}</div>
                            </div>

                            {job.remainingSlots > 0 ? (
                                <button onClick={handleApply} className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                                    Apply Now
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
