import { ClimbingBoxLoader } from "react-spinners"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

export const notify = (message, type = 'info') => {
    toast(message, {
        autoClose: 3000,
        closeButton: true,
        type: type,
        position: 'top-right',
        pauseOnHover: true,
        pauseOnFocusLoss: false
    });
}

export const LoadingOverlay = ({ loading }) => {
    if (!loading) return null;
    return (
        <div className="app-loading-container"> 
            <ClimbingBoxLoader
                color="#7ba988"
                cssOverride={{}}
                loading
                size={80}
                css={{
                    borderWidth: 5
                }}
                speedMultiplier={1}
            />
        </div>
    )
}