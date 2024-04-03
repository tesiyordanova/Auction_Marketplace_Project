import React, { useState, ChangeEvent, FormEvent } from "react";
import "./AddCauseForm.css";
import ApiService from "../../Services/ApiService";
import ApiResponseDTO from "../../Interfaces/DTOs/ApiResponseDTO";
import CauseService from "../../Services/CauseService";
import { useNavigate } from "react-router-dom";

interface AddCauseFormProps {
  onClose: () => void;
}

interface FormData {
  name: string;
  description: string;
  photo: File | null;
  amountNeeded: number;
}

const AddCauseForm: React.FC<AddCauseFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    photo: null,
    amountNeeded: 100,
  });

  const [photoError, setPhotoError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setdescriptionError] = useState<string>("");
  const [amountNeeded, setAmountNeeded] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [hideButtonAddCause, setHideButtonAddCause] = useState<boolean>(true);
  const navigate = useNavigate();

  const allowedFileTypes = ["image/jpeg", "image/png"];
  const apiService = new ApiService();
  const causeService = new CauseService(apiService);

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "amountNeeded" && !/^\d*$/.test(value)) {
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (allowedFileTypes.includes(file.type)) {
        setFormData((prevData) => ({
          ...prevData,
          photo: file,
        }));

        const reader = new FileReader();

        reader.onloadend = () => {};

        reader.readAsDataURL(file);
      } else {
        setFormData((prevData) => ({
          ...prevData,
          photo: null,
        }));
        alert("Invalid file type. Please upload a JPEG or PNG image.");
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        photo: null,
      }));
      setSubmitted(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!formData.photo) {
      setPhotoError("Please upload a photo.");
      return;
    }
    if (!formData.name) {
      setNameError("Name is required.");
      return;
    }

    if (!formData.description) {
      setdescriptionError("Description is required.");
      return;
    }

    if (formData.description.length < 100) {
      setdescriptionError("Description should be at least 100 characters.");
      return;
    }

    if (formData.description.length > 1000) {
      setdescriptionError(
        "Description should not be more than 1000 characters."
      );
      return;
    }

    if (isNaN(formData.amountNeeded)) {
      setAmountNeeded("Invalid amount.");
      return;
    }

    if (formData.amountNeeded < 1) {
      setAmountNeeded("Amount can not be negative price.");
      return;
    }

    try {
      const response: ApiResponseDTO = await causeService.createCause(formData);

      if (response.succeed) {
        console.log("Cause created successfully:", response.data);
        onClose();
      } else {
        console.error("Failed to create cause:", response.message);
      }
    } catch (error) {
      console.error("Error creating cause:", error);
      alert(`Error creating cause: `);
    }
  };

  const handleAddCause = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!formData.photo) {
      setPhotoError("Please upload a photo.");
      return;
    }
    if (!formData.name) {
      setNameError("Name is required.");
      return;
    }

    if (!formData.description) {
      setdescriptionError("Description is required.");
      return;
    }

    if (formData.description.length < 100) {
      setdescriptionError("Description should be at least 100 characters.");
      return;
    }

    if (formData.description.length > 1000) {
      setdescriptionError(
        "Description should not be more than 1000 characters."
      );
      return;
    }

    if (isNaN(formData.amountNeeded)) {
      setAmountNeeded("Invalid amount.");
      return;
    }

    if (formData.amountNeeded < 1) {
      setAmountNeeded("Amount can not be negative price.");
      return;
    }
    try {
      const createCause = await causeService.createCause(formData);
      onClose();
      navigate("/causes");
      location.reload();
    } catch (error) {
      console.error("Error updating cause:", error);
    }
  };

  return (
    <div className="add-cause-form">
      <div className="close-button" onClick={handleClose}>
        <span className="close-cross">&#10005;</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="lable-update-auction">
          <h2 className="create-cause-header">Create cause</h2>
        </div>
        <label className='label-create-auction'>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Cause Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <label className='label-create-auction'>
          Description
        </label>
        {submitted &&
          !formData.description &&
          formData.description.length == 0 && (
            <p className="please-upload-photo-p">Name is required.</p>
          )}
        <textarea
          id="description"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />

        <label className='label-create-auction'>
          Photo
        </label>
        {submitted &&
          !formData.description &&
          formData.description.length == 0 && (
            <p className="please-upload-photo-p">Description is required.</p>
          )}

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

        <input
          type="file"
          id="photo"
          name="photo"
          onChange={handleFileChange}
          accept="image/*"
        />
        {submitted && !formData.photo && (
          <p className="please-upload-photo-p">Please upload a photo.</p>
        )}

        <label className='label-create-auction'>
          Money Needed
        </label>
        <input
          className="input-amount-needed"
          id="amountNeeded"
          name="amountNeeded"
          placeholder="Money Needed"
          value={formData.amountNeeded}
          onChange={handleInputChange}
          required
        />

        {submitted && formData.amountNeeded < 100 && (
          <p className="please-upload-photo-p">Needed amount can not be under 100 BGN.</p>
        )}

        {submitted && isNaN(formData.amountNeeded) && (
          <p className="please-upload-photo-p">Invalid amount</p>
        )}

        <button
          type="submit"
          className="submit-button-cause"
          onClick={handleAddCause}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddCauseForm;
