import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import BackButton from '../components/BackButton';
import { motion } from 'framer-motion';

const CreateJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        startTime: '',
        endTime: '',
        totalSlots: '',
        paymentAmount: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/jobs', formData);
            navigate('/admin');
        } catch (error) {
            console.error("Error creating job", error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <BackButton />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200 mt-6"
                >
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Post New Opportunity</h2>
                    <p className="text-gray-600 mb-8 font-medium">Fill in the details to recruit volunteers</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-800 ml-1 uppercase tracking-wide">Job Title</label>
                            <input type="text" name="title" required onChange={handleChange} placeholder="e.g. Beach Cleanup Drive" className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-800 ml-1 uppercase tracking-wide">Description</label>
                            <textarea name="description" rows="4" required onChange={handleChange} placeholder="Describe the mission..." className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none resize-none"></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800 ml-1 uppercase tracking-wide">Location</label>
                                <input type="text" name="location" required onChange={handleChange} placeholder="City, Area or Link" className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800 ml-1 uppercase tracking-wide">Date</label>
                                <input type="date" name="date" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800 ml-1 uppercase tracking-wide">Payment (₹)</label>
                                <input type="number" name="paymentAmount" required onChange={handleChange} placeholder="Amount per volunteer" className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800 ml-1 uppercase tracking-wide">Start Time</label>
                                <input type="time" name="startTime" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-800 ml-1 uppercase tracking-wide">End Time</label>
                                <input type="time" name="endTime" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-800 ml-1 uppercase tracking-wide">Volunteers Needed</label>
                            <input type="number" name="totalSlots" required onChange={handleChange} placeholder="Number of spots" className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none" />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={() => navigate('/admin')} className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all">Cancel</button>
                            <button type="submit" className="flex-[2] px-6 py-3 rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-600/25 hover:bg-green-700 hover:transform hover:-translate-y-0.5 transition-all">Post Job</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default CreateJob;
