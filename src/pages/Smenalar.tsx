import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import SmenaQoshish from '../components/SmenaQoshish';
import ConfirmModal from '../components/ConfirmModal';
import SmenaUpdate from '../components/SmenaUpdate';

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
  const [shift_id, setShift_id] = useState<number | null>(null);

  const fetchSmenalar = () => {
    const branchId = selectedBranch || '1';
    fetch(`https://api.noventer.uz/api/v1/company/shifts/${branchId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((data: Smena[]) => setSmenalar(data))
      .catch(err => console.error('Smenalarni olishda xatolik:', err));
  };

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
    fetchSmenalar();
  }, [token, selectedBranch]);

  const handleAddSmena = () => {
    setIsModalOpen(false);
    setEditingSmena(null);
    setShift_id(null);
    fetchSmenalar(); // qayta chizish
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
          fetchSmenalar();
          setConfirmVisible(false);
          setDeleteId(null);
        } else {
          alert("Smena o‘chirilmadi. Iltimos, qayta urinib ko‘ring.");
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
          className="bg-blue-600 !text-white px-4 text-sm py-2 rounded-md shadow hover:bg-blue-700"
          onClick={() => {
            setIsModalOpen(true);
            setEditingSmena(null);
            setShift_id(null);
          }}
        >
          + Smena qo‘shish
        </button>

        <select
          className="border border-gray-300 rounded-md px-3 py-2"
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
        >
          <option value="">Filial tanlang</option>
          {branches
            .filter((branch, index, self) =>
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
              <th className="py-3 px-6 text-center">Amallar</th>
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
                  <td className="py-3 px-6 flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        setShift_id(smena.id);
                        setEditingSmena(smena);
                        setIsModalOpen(true);
                      }}
                      className="border border-blue-500 p-1 rounded"
                    >
                      <FaEdit color="blue" />
                    </button>
                    <button
                      onClick={() => startDeleteSmena(smena.id)}
                      className="border border-red-500 p-1 rounded"
                    >
                      <FaTrash color="red" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Ma’lumot topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal oynalar */}
      {isModalOpen && shift_id ? (
        <SmenaUpdate
          visible={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSmena(null);
            setShift_id(null);
          }}
          onAdd={handleAddSmena}
          filiallar={branches}
          shift_id={shift_id}
        />
      ) : (
        isModalOpen && (
          <SmenaQoshish
            visible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddSmena}
            filiallar={branches}
          />
        )
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        visible={confirmVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        description="Ushbu smenani o‘chirishni hohlaysizmi?"
        title="O‘chirishni tasdiqlang"
      />
    </div>
  );
};

export default Smenalar;
