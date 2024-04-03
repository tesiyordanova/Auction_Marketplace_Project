import { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import "./CheckoutForm.css"
import { clearToken, getToken, isTokenExpired } from "../../utils/GoogleToken";
import { Link } from "react-router-dom";

export default function CheckForm(){
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

  const stripe = useStripe();
  const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async(e : any) => {
        e.preventDefault();

        if(!stripe || !elements){
          return;
        }

        setIsProcessing(true);

        const {error} = await stripe.confirmPayment({
          elements,
          confirmParams:{
            return_url: `${"http://localhost:5173/causes"}`,  //Todo: Fix the urls!!!!
          },
        });

        if(error){
          setMessage(error.message ?? null);
        }

        setIsProcessing(false);
    }

    return(
      <div id="payment-container">
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement/>
        <button disabled={isProcessing} id="submit">
          <span id="button-text">
            {isProcessing ? "Processing" : "Pay Now"}
          </span>
        </button>
    
        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
    
    );
}