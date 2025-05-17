

import  { useEffect, useState } from 'react';
import profilfon from '../assets/bg-profil.png';
import ustki from '../assets/bg-ustki.png';
import { AiOutlineArrowLeft, AiOutlineUser, AiOutlineBank } from 'react-icons/ai';
import { Spin } from 'antd';



interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  birth_date?: string;
  gender?: string;
}

interface CompanyProfile {
  id?: number;
  name?: string;
  stir?: string;
  created_at?: string;
  license?: string;

}



const Profil = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Token topilmadi');
      setLoading(false);
      return;
    }

    const fetchUser = fetch('https://api.noventer.uz/api/v1/accounts/me/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      if (!res.ok) throw new Error('User ma’lumotlarni olishda xatolik');
      return res.json();
    });

    const fetchCompany = fetch('https://api.noventer.uz/api/v1/company/get/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      console.log(res);
      if (!res.ok) throw new Error('Company ma’lumotlarni olishda xatolik');
      return res.json();
      
    });

    Promise.all([fetchUser, fetchCompany])
      .then(([userData, companyData]) => {
        setUser(userData);
        setCompany(companyData);
        console.log(companyData);
        
        
        
      })
      .catch(err => {
        setError(err.message || 'Xatolik yuz berdi');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center  h-64">
        <Spin size="large" tip="Yuklanmoqda..." />
      </div>
    );
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className='ml-4 h-screen overflow-y-auto ml-[120px]'>
      <div className="flex items-center gap-4 px-4 py-2">
        <button className="w-8 h-8 border border-blue-500 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <AiOutlineArrowLeft size={18} />
        </button>

        <div className="flex flex-col items-center">
          <p className="text-blue-800 text-sm font-medium">Profile</p>
          <div className="w-full h-[2px] bg-blue-600 mt-1 rounded-full" />
        </div>
      </div>

      <div className="relative w-[900px] h-[200px] rounded-lg mt-2">
        <img src={profilfon} alt="fon" className="w-full h-full object-cover rounded-xl" />
        <img src={ustki} alt="ustki" className="absolute top-0 right-0 h-[210px] rounded-xl" />

        <div className="absolute top-9 right-11 w-[270px] h-[130px] p-3 text-white backdrop-blur-md rounded-lg border border-white/30 bg-white/10">
          <p className="text-[12px]">Finance card</p>
          <p className="text-[12px] pb-2">ID: 0989736</p>
          <p className="text-[14px]">Current balance:</p>
          <p className="text-[24px] font-bold">557 000 so'm</p>
        </div>

        <div className="absolute top-10 left-10 text-white flex gap-7 items-center">
          <div className="bg-white text-blue-700 w-[80px] h-[80px] rounded-[24px] flex items-center justify-center text-3xl font-bold">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <p className="text-sm pt-2">Xush kelibsiz!</p>
            <p className="text-4xl font-bold">{user?.full_name || 'Sheroz Turdiyev'}</p>
            <span className="bg-white text-gray-600 text-xs px-2 py-1 rounded mt-1 inline-block">
              Rahbar
            </span>
          </div>
        </div>
      </div>

      <div className='flex gap-[90px] mt-5'>
        <div className='w-[240px] h-[100px] flex justify-center items-center flex-col rounded-lg bg-gray-100'>
          <p className='text-[9px] text-gray-400'>Vazifalar</p>
          <p className='text-[18px] font-semibold'>0</p>
          <p className='text-[12px] text-gray-500'>Group and individual</p>
        </div>
        <div className='w-[240px] h-[100px] flex justify-center items-center flex-col rounded-lg bg-gray-100'>
          <p className='text-[9px] text-gray-400'>Rasmiy oylik</p>
          <p className='text-[18px] font-semibold'>0 som</p>
          <p className='text-[12px] text-gray-500'>1 128 000 som</p>
        </div>
        <div className='w-[240px] h-[100px] flex justify-center items-center flex-col rounded-lg bg-gray-100'>
          <p className='text-[9px] text-gray-400'>Norasmiy oylik</p>
          <p className='text-[18px] font-semibold'>0 som</p>
          <p className='text-[12px] text-gray-500'>1 168 000 som</p>
        </div>
      </div>

      <div className='flex gap-5'>

        <div className="bg-white shadow-md w-[440px] h-[220px] mt-7 p-6 rounded-xl border border-gray-300">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">
            <AiOutlineUser className="text-blue-600" size={20} />
            User Ma'lumotlari
          </h2>

          <div className="space-y-3 text-gray-700 text-sm">
            <p>
              <span className="font-medium text-gray-900">Email:</span> {user?.email || 'Ma\'lumot yo\'q'}
            </p>
            <p>
              <span className="font-medium text-gray-900">Full Name:</span> {user?.full_name || 'Ma\'lumot yo\'q'}
            </p>
            <p>
              <span className="font-medium text-gray-900">Birth Date:</span> {user?.birth_date || 'Ma\'lumot yo\'q'}
            </p>
            <p>
              <span className="font-medium text-gray-900">Gender:</span> {user?.gender || 'Ma\'lumot yo\'q'}
            </p>
          </div>
        </div>

        <div className=' bg-white shadow-md w-[440px]  border border-gray-300 h-[220px] mt-7 rounded-lg p-6'>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">
             <AiOutlineBank className="text-green-600" size={20} />
            Company Ma'lumotlari
          </h2>
          <div className="space-y-3 text-gray-700 text-sm">
            <p>
              <span className="font-medium text-gray-900">Company Name:</span> {company?.name || 'Ma\'lumot yo\'q'}
            </p>
           
            <p>
              <span className="font-medium text-gray-900">INN:</span> {company?.stir || 'Ma\'lumot yo\'q'}
            </p>
            <p>
            <p>
                <span className="font-medium text-gray-900">Ro'yxatdan o'tgan sana:</span> {
                    company?.created_at 
                    ? new Date(company.created_at).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    })
                    : "Ma'lumot yo'q"
                }
                </p>

            </p>
            <p>
              <span className="font-medium text-gray-900">Litsenziya:</span> {company?.license || 'Ma\'lumot yo\'q'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;

