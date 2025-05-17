

import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import SmenaQoshish from '../components/SmenaQoshish';
import ConfirmModal from '../components/ConfirmModal'; 

interface Branch {
  branch: number;
  branch_name: string;
}

interface Smena {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  branch: number;
  branch_name: string;
}

const Smenalar: React.FC = () => {
  const token = localStorage.getItem('access_token') || '';

  const [smenalar, setSmenalar] = useState<Smena[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

 
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [editingSmena, setEditingSmena] = useState<Smena | null>(null);





  useEffect(() => {
    fetch('https://api.noventer.uz/api/v1/company/clients/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((data: { results?: Branch[] } | Branch[]) => {
        if (Array.isArray(data)) setBranches(data);
        else if (data.results) setBranches(data.results);
      })
      .catch(err => console.error('Filiallarni olishda xatolik:', err));
  }, [token]);

  useEffect(() => {
    const branchId = selectedBranch || '1';
    fetch(`https://api.noventer.uz/api/v1/company/shifts/${branchId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((data: Smena[]) => setSmenalar(data))
      .catch(err => console.error('Smenalarni olishda xatolik:', err));
  }, [token, selectedBranch]);

  const handleAddSmena = (newSmena: Smena) => {
    setSmenalar(prev => [...prev, newSmena]);
    setIsModalOpen(false);
  };

  const startDeleteSmena = (id: number) => {
    setDeleteId(id);
    setConfirmVisible(true);
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    fetch(`https://api.noventer.uz/api/v1/company/shift-detail/${deleteId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.ok) {
          setSmenalar(prev => prev.filter(smena => smena.id !== deleteId));
          setConfirmVisible(false);
          setDeleteId(null);
        } else {
          alert('Smena o‘chirilmadi. Iltimos, qayta urinib ko‘ring.');
        }
      })
      .catch(() => alert('Server bilan bog‘lanishda xatolik yuz berdi.'));
  };


  const cancelDelete = () => {
    setConfirmVisible(false);
    setDeleteId(null);
  };

  const filteredSmenalar = selectedBranch
    ? smenalar.filter(smena => smena.branch.toString() === selectedBranch)
    : smenalar;

  return (
    <div className="pt-[56px] pl-[250px] p-6 mt-7">
      <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          className="bg-blue-600 !text-white px-4 !text-[14px] py-2 rounded-md shadow hover:bg-blue-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
         + Smena qo'shish
        </button>

        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
        >
          <option value="">Filial tanlang</option>
          {branches
            .filter(
              (branch, index, self) =>
                branch.branch !== null &&
                index === self.findIndex(b => b.branch === branch.branch)
            )
            .map(branch => (
              <option key={branch.branch} value={branch.branch.toString()}>
                {branch.branch_name}
              </option>
            ))}
        </select>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Smenalar ro‘yxati</h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
              <th className="py-3 px-6 text-left">Smena</th>
              <th className="py-3 px-6 text-left">Boshlanish vaqti</th>
              <th className="py-3 px-6 text-left">Tugash vaqti</th>
              <th className="py-3 px-6 text-left">Filial</th>
              
            </tr>
          </thead>
          <tbody>
            {filteredSmenalar.length ? (
              filteredSmenalar.map(smena => (
                <tr key={smena.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{smena.name}</td>
                  <td className="py-3 px-6">{smena.start_time}</td>
                  <td className="py-3 px-6">{smena.end_time}</td>
                  <td className="py-3 px-6">{smena.branch_name}</td>
                  <td className="py-3 px-6 flex gap-5 justify-center  text-center space-x-4">
                  <button
              onClick={() => {
                setEditingSmena(smena); 
                setIsModalOpen(true);   
              }}
              className="border border-blue-500 p-1 rounded-lg"
              aria-label="Edit"
            >
              <FaEdit color="blue" />
            </button>

                    <button
                      className="text-red-600  border p-1 rounded-lg border border-red-500 "
                      aria-label="Delete"
                      onClick={() => startDeleteSmena(smena.id)}
                    >
                      <FaTrash color='red' />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Ma'lumot topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <SmenaQoshish
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddSmena}
          filiallar={branches}
        />
      )}

     
      <ConfirmModal
        visible={confirmVisible}
        message="Rostanham o'chirmoqchimisiz?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default Smenalar;
