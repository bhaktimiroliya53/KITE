import "./ConfirmModal.css";
import { Power } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {

  if (!isOpen) return null;

  const modalTitle = title === "Logout" ? "Sign Out" : title;
  const buttonText = title === "Logout" ? "Sign Out" : confirmText;

  return (
    <div className="confirm-overlay">

      <div className="confirm-modal">

        {/* ICON */}
        <div className="confirm-icon">
          <Power 
            size={38} 
            strokeWidth={1.8} 
          />
        </div>


        {/* TITLE */}
        <h2>
          {modalTitle}
        </h2>


        {/* MESSAGE */}
        <p>
          {message}
        </p>


        {/* BUTTONS */}
        <div className="confirm-buttons">

          <button
            className="cancel-btn"
            onClick={onCancel}
          >
            {cancelText}
          </button>


          <button
            className="confirm-btn"
            onClick={onConfirm}
          >
            {buttonText}
          </button>

        </div>

      </div>

    </div>
  );
}