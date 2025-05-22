

import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Radio, DatePicker, message } from 'antd';

type XodimQoshishProps = {
  visible: boolean;
  onClose: () => void;
  branches: { id: number; name: string }[];
  onSubmit: (data: any) => void;
};

const { Option } = Select;

const XodimQoshish: React.FC<XodimQoshishProps> = ({ visible, onClose, branches, onSubmit }) => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [shifts, setShifts] = useState<{ id: number; name: string }[]>([]);
  const [branch, setBranch] = useState(null)

  const token = localStorage.getItem('access_token');
  if (!token) {
    message.error("Token topilmadi");
    return;
  }

  const handleBranchChange = async (branchId: number) => {
    form.setFieldsValue({ department_id: undefined });
    try {
      const res = await fetch(`https://api.noventer.uz/api/v1/company/departments/${branchId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      message.error("Bo‘limlarni yuklashda xatolik");
    }
  };


  const fetchShifts = async () => {
    try {
      const res = await fetch(`https://api.noventer.uz/api/v1/company/shifts/${branch}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      console.log("Shifts API natijasi:", result);

      // To‘g‘ri massivni aniqlab olish
      if (Array.isArray(result)) {
        setShifts(result);
      } else if (Array.isArray(result.data)) {
        setShifts(result.data);
      } else if (Array.isArray(result.results)) {
        setShifts(result.results);
      } else {
        message.error("Smenalar formati noto‘g‘ri.");
        setShifts([]);
      }
    } catch (err) {
      message.error("Smenalarni yuklashda xatolik");
    }
  };

  useEffect(() => {
    if (branch) {
      fetchShifts()
    }
  }, [branch])

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        const formattedData = {
          user: {
            full_name: values.fullName,
            gender: values.gender,
            phone_number: values.phone,
            passport_number: values.passport,
            jshshr: values.jshshr,
            birth_date: values.birth_date.format('YYYY-MM-DD'),
            salary_type: values.salary_type,
          },
          branch_id: Number(values.branch_id),
          department_id: Number(values.department_id),
          shift_id: Number(values.shift_id),
          position: values.position,
          salary: values.salary,
          official_salary: values.official_salary,
        };
        onSubmit(formattedData);
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
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText="Qo'shish"
      cancelText="Bekor qilish"
      centered
    >
      <Form form={form} layout="vertical" name="xodim_qoshish_form">
        <Form.Item label="F.I.Sh" name="fullName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Jinsi" name="gender" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="male">Erkak</Radio>
            <Radio value="female">Ayol</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Telefon raqam" name="phone" rules={[{ required: true }]}>
          <Input placeholder="+998..." />
        </Form.Item>

        <Form.Item label="Pasport raqami" name="passport" rules={[{ required: true }]}>
          <Input placeholder='AB1234567' />
        </Form.Item>

        <Form.Item label="JSHSHIR" name="jshshr" rules={[{ required: true }]}>
          <Input placeholder='12345...' />
        </Form.Item>

        <Form.Item label="Tug‘ilgan sana" name="birth_date" rules={[{ required: true }]}>
          <DatePicker format="YYYY-MM-DD" className="w-full" />
        </Form.Item>

        <Form.Item label="Maosh turi" name="salary_type" rules={[{ required: true }]}>
          <Select>
            <Option value="official">Rasmiy</Option>
            <Option value="unofficial">Norasmiy</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Lavozimi" name="position" rules={[{ required: true }]}>
          <Select>
            <Option value="employee">Xodim</Option>
            <Option value="manager">Menejer</Option>
            <Option value="manager">Raxbar</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Filial" name="branch_id" rules={[{ required: true }]}>
          <Select
            onChange={(value) => { handleBranchChange(value); setBranch(value); console.log("sda") }}
            placeholder="Filial tanlang"
          >
            {branches.map(branch => (
              <Option key={branch.id} value={branch.id}>
                {branch.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Bo‘lim" name="department_id" rules={[{ required: true }]}>
          <Select placeholder="Bo‘lim tanlang">
            {departments.map(dep => (
              <Option key={dep.id} value={dep.id}>
                {dep.name}
              </Option>
            ))}
          </Select>
        </Form.Item>


        <Form.Item label="Smena" name="shift_id" rules={[{ required: true }]}>
          <Select placeholder="Smena tanlang">
            {shifts.map(shift => (
              <Option key={shift.id} value={shift.id}>
                {shift.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Maosh" name="salary" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>

        <Form.Item label="Rasmiy maosh" name="official_salary" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default XodimQoshish;
