
import  { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import avatar from '../assets/avatar.png';
import XodimQoshish from '../components/XodimQoshish';
import { Spin } from 'antd';

type Xodim = {
  id: string | number;
  user_full_name: string;
  position: string;
  branch_name: string;
  user: {
    gender: string;
    phone_number: string;
  };
};

const handleAddXodim = (data: {
  fullName: string;
  gender: string;
  phone: string;
  position: string;
  branch: string;
}) => {

};

const Xodimlar = () => {
  const [xodimlar, setXodimlar] = useState<Xodim[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [branches, setBranches] = useState<{id:number, name:string}[]>([]);

const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setLoading(false);
      setError('Token topilmadi');
      return;
    }

    fetch('https://api.noventer.uz/api/v1/employee/employees/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res);
        
        if (!res.ok) throw new Error(`Hodimlarni olishda xato: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setXodimlar(data.results || []);
        console.log(data.results);
        
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  
  const uniqueBranches = Array.from(
    new Set(xodimlar.map((x) => x.branch_name).filter(Boolean))
  );

  const filteredXodimlar = selectedBranch
    ? xodimlar.filter((x) => x.branch_name === selectedBranch)
    : xodimlar;

  const paginatedXodimlar = filteredXodimlar.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center mt-60">
        <Spin size="large" tip="Yuklanmoqda..." />
      </div>
    );
  if (error) return <p className="text-center mt-10 text-red-500">Xatolik: {error}</p>;

  return (
    <div className="pt-[56px] pl-[250px] p-6 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
      <button
      onClick={() => setModalVisible(true)}
      className="bg-blue-600 hover:bg-blue-700 !text-white !text-[14px] py-2 px-4 rounded-lg shadow"
    >
      + Xodim qo'shish
    </button>

    <XodimQoshish
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      branches={branches}
      onSubmit={handleAddXodim}
    />

 
<select
  value={selectedBranch}
  onChange={(e) => {
    setSelectedBranch(e.target.value);
    setCurrentPage(1);
  }}
  className="w-full sm:w-64 border border-gray-300 px-4 py-2 rounded-xl bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
>
  <option value="">Filial tanlang</option>
  {uniqueBranches.map((branch) => (
    <option key={branch} value={branch}>
      {branch}
    </option>
  ))}
</select>

      </div>

      <h1 className="text-2xl font-bold mb-4">Xodimlar ro'yxati</h1>

      {filteredXodimlar.length === 0 ? (
        <p className="text-gray-500">Ma'lumot topilmadi</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr className="text-purple-900">
                <th className="p-3"></th>
                <th className="p-3">N#</th>
                <th className="p-3">Avatar</th>
                <th className="p-3">F.I.Sh</th>
                <th className="p-3">Jinsi</th>
                <th className="p-3">Telefon raqami</th>
                <th className="p-3">Lavozimi</th>
                <th className="p-3">Filiali</th>
              </tr>
            </thead>
            <tbody>
              {paginatedXodimlar.map((xodim, index) => (
                <tr key={xodim.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-500" />
                  </td>
                  <td className="p-3 font-medium">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="p-3">
                    <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  </td>
                  <td className="p-3 text-purple-900">{xodim.user_full_name || '—'}</td>
                  <td className="p-3 capitalize">{xodim.user.gender || '—'}</td>
                  <td className="p-3">{xodim.user.phone_number || '—'}</td>
                  <td className="p-3">{xodim.position || '—'}</td>
                  <td className="p-3">{xodim.branch_name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredXodimlar.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Xodimlar;





