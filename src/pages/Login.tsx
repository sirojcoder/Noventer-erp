import React, { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import kichiklogo from '../assets/logodark.svg'

interface LoginResponse {
  access: string
  refresh: string
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values: { phone: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.noventer.uz/api/v1/accounts/login/',
        JSON.stringify({
          phone_number: values.phone.replace(/\s/g, ''),
          password: values.password,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Login response:', response.data);
  
    
      const accessToken = response.data.data.tokens.access;
      const refreshToken = response.data.data.tokens.refresh;
  
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
  
      message.success('Kirish muvaffaqiyatli!');
  
      navigate('/dashboard');
    } catch (error) {
      let errorMessage = "Tizimga kirishda xatolik yuz berdi";
  
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Telefon raqam yoki parol noto'g'ri";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.request) {
          errorMessage = "Server bilan bog'lanib bo'lmadi. Internetingizni tekshiring.";
        }
      }
  
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen">
   
      <div className="hidden md:flex w-1/2 bg-[#0E041D] items-center justify-center p-8">
        <img src={logo} alt="logo" className="w-100" />
      </div>

   
      <div className="flex flex-col w-full md:w-1/2 justify-center items-center p-8">
        <img src={kichiklogo} alt="logo" className="py-4" />

        <Form
          name="login_form"
          style={{ width: '100%', maxWidth: 400 }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="phone"
            label="Telefon raqam"
            rules={[
              { required: true, message: 'Iltimos telefon raqamingizni kiriting!' },
              { pattern: /^\+?\d{9,15}$/, message: 'Telefon raqamni to‘g‘ri kiriting' }
            ]}
          >
            <Input placeholder="+998 90 123 45 67" type="tel" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Parol"
            rules={[{ required: true, message: 'Iltimos parolni kiriting!' }]}
          >
            <Input.Password placeholder="Parolingizni kiriting" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} size="large">
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
