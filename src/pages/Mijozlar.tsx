
import React, { useEffect, useState } from 'react';
import { Spin, Pagination } from 'antd';
import MijozQoshish from '../components/MijozQoshish';

interface Client {
  id: number;
  name: string;
  phone?: string;
  avatar?: string;
  branch_name?: string;
}

const ITEMS_PER_PAGE = 6;

const Mijozlar: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError("Token topilmadi");
      setLoading(false);
      return;
    }

    fetch('https://api.noventer.uz/api/v1/company/clients/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Xatolik: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const allClients = data.results || data;
        setClients(allClients);
        setFilteredClients(allClients);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const uniqueBranches = Array.from(
    new Set(clients.map((client) => client.branch_name).filter(Boolean))
  );

  useEffect(() => {
    if (selectedBranch) {
      const filtered = clients.filter(
        (client) => client.branch_name === selectedBranch
      );
      setFilteredClients(filtered);
      setCurrentPage(1);
    } else {
      setFilteredClients(clients);
    }
  }, [selectedBranch, clients]);

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNewClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
    setFilteredClients((prev) => [newClient, ...prev]);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-60">
        <Spin size="large" tip="Yuklanmoqda..." />
      </div>
    );
  }

  if (error) return <div className="text-red-600">Xatolik: {error}</div>;

  return (
    <div className="pt-[56px] pl-[250px] p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <MijozQoshish onSuccess={handleNewClient} />
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Barcha filiallar</option>
          {uniqueBranches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedClients.map((client) => (
          <div
            key={client.id}
            className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-6"
          >
            <img
              src={
                client.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}`
              }
              alt={client.name}
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              <h3 className="text-lg font-semibold">{client.name}</h3>
              <p className="text-gray-700   text-sm">{client.phone || 'Telefon yo‘q'}</p>
              <p className=" border border-purple-500 px-1 rounded-lg bg-[#1e1e2f] text-white   text-sm">
               Batafsil..
              </p>
            </div>
          </div>
        ))}
      </div>

      
      <div className="flex justify-center mt-8">
        <Pagination
          current={currentPage}
          pageSize={ITEMS_PER_PAGE}
          total={filteredClients.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Mijozlar;
