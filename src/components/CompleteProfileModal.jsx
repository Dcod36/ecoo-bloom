import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CompleteProfileModal = ({ isOpen, onSuccess }) => {
    const { user, updateUser } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        phone: '',
        dateOfBirth: '',
        address: '',
        emergencyContact: '',
        experience: '',
    });
    
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (selectedFile.type.startsWith('image/')) {
                setPreview(URL.createObjectURL(selectedFile));
            } else {
                setPreview(null);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (step === 1) {
            if (!formData.phone || !formData.dateOfBirth || !formData.address || !formData.emergencyContact) {
                alert("Please fill in all required fields.");
                return;
            }
            setStep(2);
            return;
        }

        if (!file) {
            alert("Please upload your ID document.");
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            data.append('idDocument', file);

            const response = await api.put('/users/profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update user in context with new profileCompleted flag
            if (response.data) {
                 updateUser({ profileCompleted: true });
                 onSuccess && onSuccess(response.data);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.response?.data?.message || "Error updating profile");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                // No onClick onClose because this modal is mandatory
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center relative">
                        <h2 className="text-3xl font-extrabold mb-2">Complete Your Profile</h2>
                        <p className="text-white/80">
                            We need a few details and your ID before you can start volunteering.
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        {/* Progress Bar */}
                        <div className="flex items-center justify-center mb-8">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>1</div>
                            <div className={`h-1 w-16 mx-2 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>2</div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {step === 1 ? (
                                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Personal Details</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" placeholder="+91 9876543210" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth *</label>
                                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Address *</label>
                                        <textarea name="address" value={formData.address} onChange={handleInputChange} required rows="2" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" placeholder="123 Eco Street, Green City..." />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Emergency Contact *</label>
                                            <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" placeholder="Name & Number" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Prior Experience</label>
                                            <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" placeholder="E.g. Beach cleanup 2023 (Optional)" />
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full py-4 mt-6 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                                        Continue to ID Upload ➔
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center justify-between">
                                        <span>Identity Verification</span>
                                        <button type="button" onClick={() => setStep(1)} className="text-sm text-blue-600 hover:underline">← Back</button>
                                    </h3>
                                    
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                                        <p className="text-sm text-amber-800 font-medium flex gap-2">
                                            <span>⚠️</span> For security reasons, NGOs require a valid Government ID (Aadhaar, PAN, Passport, or Driving License) to verify volunteers.
                                        </p>
                                    </div>

                                    <div 
                                        onClick={() => fileInputRef.current.click()}
                                        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${file ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange} 
                                            className="hidden" 
                                            accept=".jpg,.jpeg,.png,.pdf"
                                        />
                                        
                                        {preview ? (
                                            <div className="flex flex-col items-center">
                                                <img src={preview} alt="ID Preview" className="max-h-48 rounded-lg shadow-md mb-4" />
                                                <span className="text-blue-600 font-bold">Change Image</span>
                                            </div>
                                        ) : file ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">📄</div>
                                                <span className="font-bold text-gray-700">{file.name}</span>
                                                <span className="text-blue-600 font-bold mt-2">Change File</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-3xl mb-4">📸</div>
                                                <span className="font-bold text-gray-700 text-lg mb-1">Click to upload ID Document</span>
                                                <span className="text-gray-500 text-sm">JPG, PNG or PDF (Max 5MB)</span>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={loading || !file}
                                        className="w-full py-4 mt-6 rounded-xl bg-green-500 text-white font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center gap-2"
                                    >
                                        {loading ? (
                                            <><div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> Uploading...</>
                                        ) : 'Complete Profile & Start Volunteering ✅'}
                                    </button>
                                </motion.div>
                            )}
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CompleteProfileModal;
