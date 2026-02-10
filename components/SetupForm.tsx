import React, { useState } from 'react';
import { Profile } from '../types';
import { Upload, X, Heart } from 'lucide-react';

interface SetupFormProps {
  onComplete: (profile: Profile) => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('Op zoek naar mijn Valentijn 🌹');
  const [photos, setPhotos] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0) {
      alert("Voeg ten minste één foto toe!");
      return;
    }
    onComplete({ name, age, bio, photos });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-6 flex flex-col items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-tr from-rose-500 to-orange-500 p-3 rounded-full text-white">
            <Heart size={32} fill="currentColor" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800 text-center mb-2">ValenTinder Setup</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Upload je beste foto's en maak je profiel klaar voor de grote vraag.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Naam</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
              placeholder="Jouw naam"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Leeftijd</label>
            <input
              type="number"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
              placeholder="25"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
            <textarea
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition resize-none"
              rows={3}
              placeholder="Vertel iets leuks..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Foto's ({photos.length})</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden group">
                  <img src={photo} alt="Upload" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-rose-500 hover:text-rose-500 text-gray-400 transition">
                <Upload size={24} />
                <span className="text-xs mt-1">Uploaden</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-3 rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform mt-4"
          >
            Start Love Mode
          </button>
        </form>
      </div>
    </div>
  );
};