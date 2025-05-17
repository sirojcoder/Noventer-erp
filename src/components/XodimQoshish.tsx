import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select, Radio } from 'antd';

type XodimQoshishProps = {
  visible: boolean;
  onClose: () => void;
  branches: { id: number; name: string }[];
  onSubmit: (data: {
    fullName: string;
    gender: string;
    phone: string;
    position: string;
    branch: string;
  }) => void;
};

const { Option } = Select;

const XodimQoshish: React.FC<XodimQoshishProps> = ({ visible, onClose, branches, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        onSubmit(values);
        form.resetFields();
        onClose();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Yangi Xodim Qo'shish"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText="Qo'shish"
      cancelText="Bekor qilish"
      centered
    >
      <Form
        form={form}
        layout="vertical"
        name="xodim_qoshish_form"
        initialValues={{ gender: 'male', position: 'employee' }}
      >
        <Form.Item
          label="Ism Familiyasi"
          name="fullName"
          rules={[{ required: true, message: 'Iltimos, ism va familiyangizni kiriting!' }]}
        >
          <Input placeholder="Ism Familiyasi" />
        </Form.Item>

        <Form.Item
          label="Jinsi"
          name="gender"
          rules={[{ required: true, message: 'Iltimos, jinsingizni tanlang!' }]}
        >
          <Radio.Group>
            <Radio value="male">Erkak</Radio>
            <Radio value="female">Ayol</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Telefon Raqami"
          name="phone"
          rules={[
            { required: true, message: 'Telefon raqamingizni kiriting!' },
            { pattern: /^\+998\d{9}$/, message: 'Telefon raqami +998XXXXXXXXX ko‘rinishida bo‘lishi kerak!' },
          ]}
        >
          <Input placeholder="+998901234567" />
        </Form.Item>

        <Form.Item
          label="Lavozimi"
          name="position"
          rules={[{ required: true, message: 'Lavozimni kiriting!' }]}
        >
          <Select placeholder="Lavozimni tanlang">
            <Option value="employee">Xodim</Option>
            <Option value="manager">Meneger</Option>
            <Option value="director">Direktor</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Filial"
          name="branch"
          rules={[{ required: true, message: 'Filialni tanlang!' }]}
        >
          <Select placeholder="Filialni tanlang">
            {branches.map(branch => (
              <Option key={branch.id} value={branch.name}>
                {branch.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default XodimQoshish;
