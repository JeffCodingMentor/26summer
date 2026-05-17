'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthday, parentPhone }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard');
      } else if (data.needsRegistration) {
        setNeedsRegistration(true);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={`glass-panel animate-fade-in ${styles.loginBox}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Summer Enrollment</h1>
          <p className={styles.subtitle}>Sign in or register for classes</p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {needsRegistration && (
          <div className={`${styles.infoBox} animate-fade-in`}>
            Welcome! It looks like you're new here. Please provide a parent phone number to complete your registration.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Student Name (中文姓名)</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={e => setName(e.target.value)}
              className={styles.input}
              placeholder="例如：王小明"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Birthday (YYYYMMDD)</label>
            <input 
              type="text" 
              required 
              pattern="\d{8}"
              value={birthday}
              onChange={e => setBirthday(e.target.value)}
              className={styles.input}
              placeholder="例如：20100520"
              disabled={loading}
            />
          </div>

          {needsRegistration && (
            <div className={`${styles.formGroup} animate-fade-in`}>
              <label className={styles.label}>Parent Phone (家長電話)</label>
              <input 
                type="tel" 
                required={needsRegistration}
                value={parentPhone}
                onChange={e => setParentPhone(e.target.value)}
                className={styles.input}
                placeholder="0912345678"
                disabled={loading}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`btn-primary ${styles.submitBtn}`}
          >
            {loading ? 'Processing...' : (needsRegistration ? 'Complete Registration' : 'Sign In')}
          </button>
        </form>
      </div>
    </main>
  );
}
