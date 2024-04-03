import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { clearToken, getToken, isTokenExpired } from '../../utils/GoogleToken';
import ApiService from '../../Services/ApiService';
import PaymentService from '../../Services/PaymentService';
import UserService from '../../Services/UserService';
import ApiResponseDTO from '../../Interfaces/DTOs/ApiResponseDTO';
import PaymentDTO from '../../Interfaces/DTOs/PaymentDTO';
import CauseService from '../../Services/CauseService';
import AuctionService from '../../Services/AuctionService';

interface PaymentHistoryFormProps {
    onClose: () => void;
}

const PaymentHistoryForm: React.FC<PaymentHistoryFormProps> = ({ onClose }) => {
    const token = getToken();
    const apiService = new ApiService;
    const paymentService = new PaymentService(apiService);
    const userService = new UserService(apiService);
    const causeService = new CauseService(apiService);
    const auctionService = new AuctionService(apiService);
    const [paymentHistory, setPaymentHistory] = useState<PaymentDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [causeNames, setCauseNames] = useState<{ [key: number]: string }>({});
    const [auctionsNames, setAuctionsNames] = useState<{ [key: number]: string }>({});

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
    };

    const fetchUserData = async () => {
        try {
            if (token) {
                const response: ApiResponseDTO = await userService.fetchUser();
                if (response.succeed) {
                    const userId = response.data.userId;
                    return userId;
                }
            }
        } catch (error) {
            console.error('Error during user profile fetch:', error);
        }
        return null;
    };

    const handleClose = () => {
        onClose();
        window.history.back();
    }
    const fetchPaymentHistory = async (userId: number | null) => {
        try {
            if (userId) {
                setLoading(true);
                const response = await paymentService.getPaymentByUserId();
                const payments: PaymentDTO[] = response as unknown as PaymentDTO[];

                const causeIds: number[] = payments.map(payment => payment.causeId).filter(Boolean);
                const auctionIds: number[] = payments.map(payment => payment.auctionId).filter(Boolean);

                const causeNames: { [key: number]: string } = {};
                const auctionNames: { [key: number]: string } = {};

                for (const causeId of causeIds) {
                    const causeResponse = await causeService.getCauseById(causeId);
                    causeNames[causeId] = causeResponse.data.name;
                }

                for (const auctionId of auctionIds) {
                    const auctionResponse = await auctionService.getAuctionById(auctionId);
                    auctionNames[auctionId] = auctionResponse.data.name;
                }

                setCauseNames(causeNames);
                setAuctionsNames(auctionNames);

                const updatedPayments = payments.map(payment => ({
                    ...payment,
                    type: payment.causeId !== null ? 'Cause' : 'Auction',
                    name: payment.causeId !== null ? causeNames[payment.causeId] : auctionNames[payment.auctionId]
                }));

                setPaymentHistory(updatedPayments);
            }
        } catch (error) {
            console.error('Error fetching payment history:', error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && !isTokenExpired()) {
            const fetchUserProfileAndPaymentHistory = async () => {
                const userId = await fetchUserData();
                fetchPaymentHistory(userId);
            };
            fetchUserProfileAndPaymentHistory();
        } else {
            clearToken();
        }
    }, [token]);

    return (
        <div className='payment-history-container'>
            <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={handleClose} />
            <h2 className='header-payment-history-container'> Payment History</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table className='table-history'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Cause Name</th>
                            <th>Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((payment, index) => (
                            <tr key={index}>
                                <td>{formatDate(payment.createdAt)}</td>
                                <td>{payment.amount}</td>
                                <td>
                                    {payment.causeId !== null ? (
                                        causeNames[payment.causeId]
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td>{payment.isCompleted.toString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PaymentHistoryForm;