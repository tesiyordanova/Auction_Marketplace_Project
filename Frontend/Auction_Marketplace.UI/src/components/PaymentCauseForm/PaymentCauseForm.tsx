import React, { useEffect, useState } from 'react';
import './PaymentCauseForm.css'
import ApiService from '../../Services/ApiService';
import PaymentService from '../../Services/PaymentService';
import UserService from '../../Services/UserService';

interface PaymentsFormProps {
    causeId: number;
    onClose: () => void;
}

const PaymentCauseForm: React.FC<PaymentsFormProps> = ({ causeId, onClose }) => {
    const [payments, setPayments] = useState<any[]>([]);
    const apiService = new ApiService();
    const [loading, setLoading] = useState<boolean>(true);
    const paymentService = new PaymentService(apiService);
    const [users, setUsers] = useState<any[]>([]);
    const userService = new UserService(apiService);

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
    
    const fetchPayments = async () => {
        setLoading(true);

        try {
            const paymentData = await paymentService.getPaymentByUserId();

            const causePayments = paymentData.filter(payment => payment.causeId === causeId);

            const userIds = causePayments.map(payment => payment.userId);

            const usersDataPromises = userIds.map(async (userId) => {
                const userData = await userService.fetchUser();
                return userData.data;
            });

            const usersData = await Promise.all(usersDataPromises);
            setPayments(causePayments);
            setUsers(usersData);

        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [causeId]);

    return (
        <div className="payments-form-container">
            <h3 className='header-payment-history'>Payments History</h3>
            {loading ? (
                <div>Loading...</div>
            ) : (
                payments.length > 0 ? (
                    <table className='history-table'>
                        <thead>
                            <tr>
                                <th className='th-rows-payment-history'>User</th>
                                <th className='th-rows-payment-history'>Email</th>
                                <th className='th-rows-payment-history'>Amount</th>
                                <th className='th-rows-payment-history'>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={index}>
                                    <td className='td-rows-payment-history'>{users[index]?.firstName} {users[index]?.lastName}</td>
                                    <td className='td-rows-payment-history'>{users[index]?.email}</td>
                                    <td className='td-rows-payment-history'>{payment.amount}</td>
                                    <td className='td-rows-payment-history'>{formatDate(payment.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div>No payments available for this cause.</div>
                )
            )}
            <div className="form-buttons">
                <button type="button" className='close-btn' onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};


export default PaymentCauseForm;
