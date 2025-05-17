
import React, { useState } from 'react';
import { Modal, Button, Form, Input, Upload, message, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface MijozQoshishProps {
  onSuccess: (newClient: any) => void;
}

const MijozQoshish: React.FC<MijozQoshishProps> = ({ onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<any[]>([]);
  const [licenseFile, setLicenseFile] = useState<any[]>([]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setAvatarFile([]);
    setLicenseFile([]);
  };

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Faqat rasm fayllarini yuklash mumkin!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const onFinish = async (values: any) => {
    const token = localStorage.getItem('access_token');
    console.log(token);
    
    if (!token) {
      message.error('Token topilmadi');
      return;
    }

    if (avatarFile.length === 0 || licenseFile.length === 0) {
      message.error('Iltimos, rasm fayllarini yuklang');
      return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('phone', values.phone);
    formData.append('avatar', avatarFile[0].originFileObj);
    formData.append('license_file', licenseFile[0].originFileObj);

    setLoading(true);
    try {
      const res = await fetch('https://api.noventer.uz/api/v1/company/clients/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error(`Xatolik: ${res.status}`);
      const newClient = await res.json();
      message.success('Mijoz muvaffaqiyatli qo‘shildi!');
      onSuccess(newClient);
      handleCancel();
    } catch (err: any) {
      message.error(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        + Mijoz qo'shish
      </Button>

      <Modal
        title="Yangi mijoz qo'shish"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Mijoz nomi"
            name="name"
            rules={[{ required: true, message: 'Iltimos, mijoz nomini kiriting' }]}
          >
            <Input placeholder="Masalan: Aliyev Kompaniyasi" />
          </Form.Item>

          <Form.Item
            label="Telefon raqami"
            name="phone"
            rules={[{ required: true, message: 'Telefon raqamini kiriting' }]}
          >
            <Input placeholder="+998..." />
          </Form.Item>

          <Form.Item label="Avatar rasmi" required>
            <Upload
              beforeUpload={beforeUpload}
              maxCount={1}
              fileList={avatarFile}
              onChange={({ fileList }) => setAvatarFile(fileList)}
              accept="image/*"
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
            </Upload>
            <Typography.Text type="secondary" style={{ marginTop: 4, display: 'block' }}>
              Iltimos, foydalanuvchi rasmini yuklang
            </Typography.Text>
          </Form.Item>

          <Form.Item label="Litsenziya rasmi" required>
            <Upload
              beforeUpload={beforeUpload}
              maxCount={1}
              fileList={licenseFile}
              onChange={({ fileList }) => setLicenseFile(fileList)}
              accept="image/*"
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
            </Upload>
            <Typography.Text type="secondary" style={{ marginTop: 4, display: 'block' }}>
              Litsenziya rasmini yuklang
            </Typography.Text>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MijozQoshish;
