import React from 'react';
import { Modal } from 'antd';

interface ConfirmModalProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ visible, message, onConfirm, onCancel }) => {
  return (
    <Modal
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Ha, o'chiraman"
      cancelText="Bekor qilish"
      centered
      okButtonProps={{ danger: true }}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmModal;
