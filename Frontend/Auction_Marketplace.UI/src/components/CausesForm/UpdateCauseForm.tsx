import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import ApiService from '../../Services/ApiService';
import ApiResponseDTO from '../../Interfaces/DTOs/ApiResponseDTO';
import UpdateCauseDTO from '../../Interfaces/DTOs/UpdateCauseDTP';
import CauseService from '../../Services/CauseService';
import { useNavigate } from 'react-router-dom';

interface UpdateCauseFormProps {
    onClose: () => void;
    causeId: number;
    initialCauseData: UpdateCauseDTO | null;
}

interface FormData {
    name: string;
    description: string;
    amountNeeded: number
}

const UpdateCauseForm: React.FC<UpdateCauseFormProps> = ({ causeId, onClose, initialCauseData: initialCauseData }) => {

    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        amountNeeded: 0
    });

    const navigate = useNavigate();
    const apiService = new ApiService();
    const causeService = new CauseService(apiService);
    const [nameError, setNameError] = useState<string>('');
    const [descriptionError, setDescriptionError] = useState<string>('');
    const [amountNeededError, setAmountNeededError] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        if (initialCauseData) {
            setFormData({
                name: initialCauseData.name,
                description: initialCauseData.description,
                amountNeeded: initialCauseData.amountNeeded
            });
        }
    }, [initialCauseData]);


    const handleClose = () => {
        onClose();
        window.history.back();
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateCause = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        if (!formData.name) {
            setNameError('Please enter a name.');
            return;
        }

        if (!formData.description) {
            setDescriptionError('Please enter a description.');
            return;
        }

        if (formData.description.length < 100) {
            setDescriptionError("Description should be at least 100 characters.");
            return;
        }

        if (formData.description.length > 1000) {
            setDescriptionError("Description should not be more than 1000 characters.");
            return;
        }

        if (!formData.amountNeeded) {
            setAmountNeededError('Amount is required.');
            return;
        }

        if (isNaN(formData.amountNeeded) || formData.amountNeeded < 0) {
            setAmountNeededError('Invalid amount.');
            return;
        }

        try {
            const updatedCause = await causeService.updateCause(causeId, formData);
            onClose()
            navigate('/causes');
        } catch (error) {
            console.error('Error updating cause:', error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        if (!formData.name) {
            setNameError('Please enter a name.');
            return;
        }

        if (!formData.description) {
            setDescriptionError('Please enter a description.');
            return;
        }

        if (formData.description.length < 100) {
            setDescriptionError("Description should be at least 100 characters.");
            return;
        }

        if (formData.description.length > 1000) {
            setDescriptionError("Description should not be more than 1000 characters.");
            return;
        }

        if (!formData.amountNeeded) {
            setAmountNeededError('Amount is required.');
            return;
        }

        if (isNaN(formData.amountNeeded) || formData.amountNeeded < 0) {
            setAmountNeededError('Invalid amount.');
            return;
        }

        try {
            const response: ApiResponseDTO = await causeService.updateCause(causeId, formData);

            if (response.succeed) {
                console.log('Cause updated successfully:', response.data);
                onClose();
            } else {
                console.error('Failed to update cause:', response.message);
            }
        } catch (error) {
            console.error('Error updating cause:', error);
            onClose();
            alert(`Error updating cause: `);
        }
    };

    return (
        <div className="add-cause-form">
            <div className="close-button" onClick={handleClose}>
                <span className="close-cross">&#10005;</span>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='lable-update-auction'>
                    <h2 className='create-cause-header' >Update: {formData?.name}</h2>
                </div>
                <label>
                    Cause name:
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                {submitted && !formData.name &&
                    <p className="error-message">{nameError}
                    </p>
                }

                <label>
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />
                {submitted && !formData.description &&
                    <p className="error-message">{descriptionError}
                    </p>}

                {submitted &&
                    formData.description.length > 0 &&
                    formData.description.length < 100 && (
                        <p className="please-upload-photo-p">
                            Description should be at least 100 characters.
                        </p>
                    )}

                {submitted && formData.description.length > 1000 && (
                    <p className="please-upload-photo-p">
                        Description should not be more than 1000 characters.
                    </p>
                )}

                <label>
                    Amount Needed
                </label>
                <textarea
                    id="amountNeeded"
                    name="amountNeeded"
                    placeholder="Amount needed"
                    value={formData.amountNeeded}
                    onChange={handleInputChange}
                    required
                />
                {submitted && amountNeededError && <p className="error-message">{amountNeededError}</p>}

                {submitted &&
                    (formData.amountNeeded < 0 || isNaN(formData.amountNeeded)) && (
                        <p className="please-upload-photo-p">Inavalid Amount.</p>
                    )}

                <button type="submit" className='submit-button-cause' onClick={handleUpdateCause}>Submit</button>
            </form>
        </div>
    );
}

export default UpdateCauseForm;
