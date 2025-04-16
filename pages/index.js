import { useEffect, useState } from 'react';
import PruebaForm from '../components/PruebaForm';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const [pruebas, setPruebas] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    const res = await fetch('/api/pruebas');
    const data = await res.json();
    setPruebas(data);
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  // 👇 Login screen if not authenticated
  if (!session) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl mb-4">🔐 Necesitas iniciar sesión</h2>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Iniciar sesión con Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* 👤 Session Info and Logout */}
      <div className="text-right mb-4">
        <span className="mr-4">Hola, {session.user.name}</span>
        <button
          onClick={() => signOut()}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Cerrar sesión
        </button>
      </div>

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
              <th className="border px-2 py-1">Acciones</th>
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
                <td className="border px-2 py-1 space-x-2">
                  <button
                    className="bg-blue-200 px-2 py-1 rounded"
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
