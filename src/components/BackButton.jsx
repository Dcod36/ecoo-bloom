import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-text-muted font-medium hover:bg-white hover:text-primary hover:shadow-md transition-all duration-300 mb-6 text-sm"
        >
            <FaArrowLeft /> Back
        </button>
    );
};

export default BackButton;
