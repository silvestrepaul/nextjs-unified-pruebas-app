import { useEffect, useState } from 'react';
import PruebaForm from '../components/PruebaForm';

export default function Home() {
  const [pruebas, setPruebas] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    const res = await fetch('/api/pruebas');
    const data = await res.json();
    setPruebas(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Pruebas (Unificado)</h1>
      <div className="bg-white shadow p-4 rounded mb-6">
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Nombre</th>
              <th className="border px-2 py-1">Contraseña</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Tarjeta</th>
              <th className="border px-2 py-1">Monto</th>
              <th className="border px-2 py-1">Editar</th>
            </tr>
          </thead>
          <tbody>
            {pruebas.map((p) => (
              <tr key={p.Consecutivo}>
                <td className="border px-2 py-1">{p.Nombre}</td>
                <td className="border px-2 py-1">{p.Contraseña}</td>
                <td className="border px-2 py-1">{p.email}</td>
                <td className="border px-2 py-1">{p.tarjeta}</td>
                <td className="border px-2 py-1">{p.monto}</td>
                <td className="border px-2 py-1">
                  <button className="bg-blue-200 px-2 py-1 rounded" onClick={() => setEditing(p)}>
                    Editar
                  </button>
                </td>
                <td className="border px-2 py-1">
                  <button
                    className="bg-blue-200 px-2 py-1 rounded mr-2"
                    onClick={() => setEditing(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={async () => {
                      const confirmDelete = confirm(`¿Seguro que quieres eliminar "${p.Nombre}"?`);
                      if (confirmDelete) {
                        await fetch('/api/pruebas', {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ Consecutivo: p.Consecutivo })
                        });
                        fetchData(); // Refresh after delete
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PruebaForm current={editing} refresh={fetchData} />
    </div>
  );
}
