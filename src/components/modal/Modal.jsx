import React from "react";
import "./style.scss"; // You can style the modal in a separate CSS file
import { VscChromeClose } from "react-icons/vsc";
const Modal = ({ isOpen, onClose, onConfirm, title, content, btnContent }) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <span className="close-btn" onClick={onClose}>
            <VscChromeClose />
          </span>
        </div>
        <div className="modal-body">{content}</div>
        <div className="modal-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>{btnContent}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
