import { useEffect, useState } from 'react';

export default function PruebaForm({ current, refresh }) {
  const [formData, setFormData] = useState({
    Nombre: '', Contraseña: '', email: '', tarjeta: '', monto: ''
  });

  useEffect(() => {
    if (current) setFormData(current);
  }, [current]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const method = current?.Consecutivo ? 'PUT' : 'POST';
    const body = {
      ...formData,
      monto: Number(formData.monto),
      ...(current?.Consecutivo && { Consecutivo: current.Consecutivo })
    };

    await fetch('/api/pruebas', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    setFormData({ Nombre: '', Contraseña: '', email: '', tarjeta: '', monto: '' });
    refresh();
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">{current ? 'Editar' : 'Agregar'} Prueba</h2>
      {['Nombre', 'Contraseña', 'email', 'tarjeta', 'monto'].map((field) => (
        <input
          key={field}
          name={field}
          value={formData[field] || ''}
          onChange={handleChange}
          placeholder={field}
          className="block w-full border mb-3 p-2 rounded"
        />
      ))}
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
        Guardar
      </button>
    </div>
  );
}
