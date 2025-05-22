


import { Modal, Button, Form, Input, Select, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

interface Filial {
  branch: number;
  branch_name: string;
}

interface SmenaUpdateProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (updatedSmena: any) => void;
  filiallar: Filial[];
  shift_id: number;
}

const SmenaUpdate: React.FC<SmenaUpdateProps> = ({ visible, onClose, onAdd, filiallar, shift_id }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const token = localStorage.getItem('access_token') || '';

  // Ma'lumotlarni olish
  useEffect(() => {
    if (visible && shift_id) {
      fetch(`https://api.noventer.uz/api/v1/company/shift-detail/${shift_id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error("API dan ma'lumot olishda xatolik");
          return res.json();
        })
        .then(data => {
          form.setFieldsValue({
            name: data.name,
            start_time: dayjs(data.start_time, 'HH:mm'),
            end_time: dayjs(data.end_time, 'HH:mm'),
            branch: data.branch,
          });
        })
        .catch(err => {
          console.error("Xatolik:", err);
          message.error("Smena ma'lumotlarini olishda xatolik yuz berdi.");
        });
    }
  }, [shift_id, visible, form]);

  // Formani yuborish
  const onFinish = async (values: any) => {
    const payload = {
      name: values.name,
      start_time: dayjs(values.start_time).format('HH:mm'),
      end_time: dayjs(values.end_time).format('HH:mm'),
      branch: values.branch,
    };

    setLoading(true);
    try {
      const response = await fetch(`https://api.noventer.uz/api/v1/company/shift-detail/${shift_id}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Xatolik:", data);
        message.error('Xatolik: ' + (data.message || JSON.stringify(data)));
        return;
      }

      message.success("Smena muvaffaqiyatli yangilandi");
      onAdd(data);
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Smena tahrirlanishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Smenani tahrirlash"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Smena nomi"
          name="name"
          rules={[{ required: true, message: 'Smena nomini kiriting' }]}
        >
          <Input placeholder="Masalan: Kechki smena" />
        </Form.Item>

        <Form.Item
          label="Boshlanish vaqti"
          name="start_time"
          rules={[{ required: true, message: 'Boshlanish vaqtini tanlang' }]}
        >
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Tugash vaqti"
          name="end_time"
          rules={[{ required: true, message: 'Tugash vaqtini tanlang' }]}
        >
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Filial"
          name="branch"
          rules={[{ required: true, message: 'Filialni tanlang' }]}
        >
          <Select placeholder="Filial tanlang">
            {filiallar.map(filial => (
              <Option key={filial.branch} value={filial.branch}>
                {filial.branch_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SmenaUpdate;
