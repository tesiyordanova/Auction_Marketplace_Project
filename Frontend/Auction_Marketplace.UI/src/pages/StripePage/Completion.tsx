import { useEffect } from "react";
import { clearToken, getToken, isTokenExpired } from "../../utils/GoogleToken";
import { Link} from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Completion.css";

function Completion(){
    const token = getToken();

  useEffect(() => {
    if (isTokenExpired()) {
      clearToken();
    }
  }, []);
  
  if (!token) {
    return (
      <div className='token-exp-container'>
        <div className='token-exp-content'>
          <p>Please log in to access this page.</p>
          <Link to="/login">Login</Link>
        </div>
      </div>
    );
  }

   const navigateToCauses = () => {
        window.location.href = 'http://localhost:5173/causes';
    };
  
    return (
        <div>
          <Navbar showAuthButtons={false} />
          <div className="completion-container">
            <div className="tick-mark">&#10003;</div>
            <h1 className="completion-heading">Payment Successful!</h1>
            <p className="completion-textline">Your payment has been completed.</p> 
            <button className="back-button" onClick={navigateToCauses}>Back</button>
          </div>
        </div>
    
    )
}
export default Completion;