import React, { useState } from 'react';
import { useAuth } from './InputSection';
import { Modal } from './ActionButton';

interface AuthModalProps {
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, showToast }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login, signup } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isLoginView) {
        await login(email, password);
        showToast('Login successful!', 'success');
      } else {
        await signup(name, email, password);
        showToast('Signup successful! Welcome.', 'success');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Modal title={isLoginView ? 'Login' : 'Sign Up'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {!isLoginView && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-800/70 border border-slate-700 rounded-md p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-800/70 border border-slate-700 rounded-md p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-800/70 border border-slate-700 rounded-md p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          <p className="text-xs text-slate-500 mt-1">Hint: Use password 'password' for mock login.</p>
        </div>
        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full text-base font-semibold text-white bg-blue-600 rounded-md px-8 py-2.5 transition-all duration-300 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 disabled:bg-slate-500 disabled:cursor-not-allowed">
            {isLoading ? 'Processing...' : (isLoginView ? 'Login' : 'Create Account')}
          </button>
        </div>
         <p className="text-center text-sm text-slate-400 pt-2">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button type="button" onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-400 hover:underline ml-1">
              {isLoginView ? "Sign Up" : "Login"}
            </button>
        </p>
      </form>
    </Modal>
  );
};