import { useState, useEffect } from 'react';
import type { FormEvent } from 'react'; 
import { useAuth } from '../core/context/AuthContext';
import AuthService from '../core/service/AuthService';

function MyProfile() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setMessage({ text: 'Nove lozinke se ne podudaraju', type: 'error' });
        setLoading(false);
        return;
      }

      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await AuthService.updateProfileData(updateData);
      await refreshUser();
      setMessage({ text: 'Profil je uspešno ažuriran', type: 'success' });
      setEditing(false);
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      setMessage({ 
        text: error.error || 'Došlo je do greške prilikom ažuriranja profila', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50!">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600! mb-4"></div>
          <p className="text-gray-600! font-medium">Učitavanje profila...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 bg-gray-50! dark:bg-dark! min-h-screen transition-colors duration-300">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900! dark:text-white! tracking-tight">Moj Profil</h1>
        <p className="text-gray-500! dark:text-gray-400! mt-1">Upravljajte svojim ličnim podacima.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl border! transition-all ${
          message.type === 'success' 
            ? 'bg-green-50! border-green-200! text-green-800! dark:bg-green-900/20! dark:border-green-800! dark:text-green-300!' 
            : 'bg-red-50! border-red-200! text-red-800! dark:bg-red-900/20! dark:border-red-800! dark:text-red-300!'
        }`}>
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white! dark:bg-gray-900! rounded-2xl shadow-sm border! border-gray-100! dark:border-gray-800! overflow-hidden">
        <div className="px-6 py-4 border-b! border-gray-100! dark:border-gray-800! flex justify-between items-center bg-white! dark:bg-gray-900!">
          <h2 className="text-lg font-bold text-gray-800! dark:text-white!">Lične informacije</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-indigo-600! text-white! font-semibold rounded-lg hover:bg-indigo-700! shadow-sm transition-all"
            >
              Izmeni profil
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600! dark:text-gray-400! uppercase mb-1">Ime</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-2 border! border-gray-200! dark:border-gray-700! rounded-lg focus:ring-2 focus:ring-indigo-500! bg-white! dark:bg-gray-950! text-gray-900! dark:text-white! disabled:bg-gray-50! dark:disabled:bg-gray-800! disabled:text-gray-400!"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600! dark:text-gray-400! uppercase mb-1">Prezime</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-2 border! border-gray-200! dark:border-gray-700! rounded-lg focus:ring-2 focus:ring-indigo-500! bg-white! dark:bg-gray-950! text-gray-900! dark:text-white! disabled:bg-gray-50! dark:disabled:bg-gray-800! disabled:text-gray-400!"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600! dark:text-gray-400! uppercase mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border! border-gray-200! dark:border-gray-700! rounded-lg bg-gray-50! dark:bg-dark! text-gray-400! cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600! dark:text-gray-400! uppercase mb-1">Telefon</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-2 border! border-gray-200! dark:border-gray-700! rounded-lg focus:ring-2 focus:ring-indigo-500! bg-white! dark:bg-gray-950! text-gray-900! dark:text-white! disabled:bg-gray-50! dark:disabled:dark:bg-gray-800! disabled:text-gray-400!"
              />
            </div>
          </div>

          {editing && (
            <div className="mt-6 pt-6 border-t! border-gray-100! dark:border-gray-800! animate-in fade-in">
              <h3 className="text-md font-bold text-gray-800! dark:text-white! mb-4">Promena lozinke</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                  type="password"
                  placeholder="Trenutna"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border! border-gray-200! dark:border-gray-700! rounded-lg bg-white! dark:bg-gray-800! text-white!"
                />
                <input
                  type="password"
                  placeholder="Nova"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border! border-gray-200! dark:border-gray-700! rounded-lg bg-white! dark:bg-gray-800! text-white!"
                />
                <input
                  type="password"
                  placeholder="Potvrda"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border! border-gray-200! dark:border-gray-700! rounded-lg bg-white! dark:bg-gray-800! text-white!"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600! text-white! font-bold rounded-xl hover:bg-indigo-700!">Sačuvaj</button>
                <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 bg-gray-100! dark:bg-gray-800! text-gray-700! dark:text-gray-300! font-bold rounded-xl">Otkaži</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default MyProfile;