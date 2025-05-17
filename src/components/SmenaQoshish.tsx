
import { Modal, Button, Form, Input, Select, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

const { Option } = Select;

interface Filial {
  branch: number;
  branch_name: string;
}

interface SmenaQoshishProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (newSmena: any) => void;
  filiallar: Filial[];
}

const SmenaQoshish: React.FC<SmenaQoshishProps> = ({ visible, onClose, onAdd, filiallar }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const token = localStorage.getItem('access_token') || '';

  const onFinish = async (values: any) => {
    const payload = {
      name: values.name,
      start_time: dayjs(values.start_time).format('HH:mm'),
      end_time: dayjs(values.end_time).format('HH:mm'),
      branch: values.filial_id,
    };

    setLoading(true);
    try {
      const response = await fetch('https://api.noventer.uz/api/v1/company/shift-create/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        message.error('Xatolik: ' + (data.message || JSON.stringify(data)));
        setLoading(false);
        return;
      }

      message.success("Smena muvaffaqiyatli qo‘shildi");
      form.resetFields();
      onAdd(data);
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Smena qo'shishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Yangi smena qo'shish"
      visible={visible}
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
          <Input placeholder="Masalan: Tonggi smena" />
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
          name="filial_id"
          rules={[{ required: true, message: 'Filialni tanlang' }]}
        >
         <Select placeholder="Filial tanlang" disabled={!filiallar || filiallar.length === 0}>
            {filiallar && filiallar.length > 0 ? (
              filiallar
                .filter((filial, index, self) =>
                  index === self.findIndex(f => f.branch === filial.branch)
                )
                .map(filial => (
                  <Option key={filial.branch} value={filial.branch}>
                    {filial.branch_name}
                  </Option>
                ))
            ) : (
              <Option disabled>Filiallar mavjud emas</Option>
            )}
          </Select>


        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Qo'shish
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SmenaQoshish;
