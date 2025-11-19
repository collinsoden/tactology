'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  // Handle form submission for login
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { accessToken } = await login(username, password);
      setToken(accessToken);
      router.push('/departments');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

    // Ensure user is redirected if already logged in
  useEffect(() => {
    console.log('Current token:', token);
    if (token) {
      router.push('/departments');
      return;
    }
  }, []);

  return (
    <div
      style={{
        width: 360,
        padding: 24,
        borderRadius: 16,
        background: 'rgba(15,23,42,0.95)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        border: '1px solid rgba(148,163,184,0.2)',
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 6 }}>Welcome back</h1>
      <p style={{ fontSize: 14, opacity: 0.75, marginBottom: 20 }}>
        Log in to manage departments and sub-departments.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: 12 }}
      >
        <label style={{ fontSize: 14 }}>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              marginTop: 4,
              width: '100%',
              borderRadius: 8,
              padding: '8px 10px',
              border: '1px solid #1f2937',
              background: '#020617',
              color: '#e5e7eb',
            }}
            placeholder="admin"
          />
        </label>

        <label style={{ fontSize: 14 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              marginTop: 4,
              width: '100%',
              borderRadius: 8,
              padding: '8px 10px',
              border: '1px solid #1f2937',
              background: '#020617',
              color: '#e5e7eb',
            }}
            placeholder="password"
          />
        </label>

        {error && (
          <div style={{ color: '#fb7185', fontSize: 13 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8,
            borderRadius: 999,
            padding: '8px 0',
            border: 'none',
            background:
              'linear-gradient(135deg,#22c55e,#14b8a6,#3b82f6)',
            color: '#020617',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
