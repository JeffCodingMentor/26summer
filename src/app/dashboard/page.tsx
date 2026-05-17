'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, addDays, isWeekend, parseISO } from 'date-fns';
import styles from './page.module.css';

// Generate 30 weekdays starting from 2026-07-20
const START_DATE = new Date('2026-07-20T00:00:00');
const generateDates = () => {
  const dates = [];
  let current = START_DATE;
  while (dates.length < 30) {
    if (!isWeekend(current)) {
      dates.push(format(current, 'yyyy-MM-dd'));
    }
    current = addDays(current, 1);
  }
  return dates;
};

const DATES = generateDates();

export default function DashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [companionMode, setCompanionMode] = useState(false);
  const [companionName, setCompanionName] = useState('');
  const [companionId, setCompanionId] = useState<string | null>(null);
  const [companionError, setCompanionError] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState<{ date: string, slot?: number } | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/bookings?startDate=${DATES[0]}&endDate=${DATES[DATES.length - 1]}`);
      if (res.status === 401) return router.push('/');
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyCompanion = async (name: string) => {
    if (!name) {
      setCompanionId(null);
      setCompanionError('');
      return;
    }
    try {
      const res = await fetch('/api/auth/verify-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        setCompanionId(data.companionId);
        setCompanionError('');
      } else {
        setCompanionId(null);
        setCompanionError(`「${name}」 未註冊`);
      }
    } catch (err) {
      setCompanionError('驗證錯誤');
    }
  };

  const handleCompanionBlur = () => verifyCompanion(companionName);
  
  const handleCompanionToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanionMode(e.target.checked);
    if (!e.target.checked) {
      setCompanionName('');
      setCompanionId(null);
      setCompanionError('');
    }
  };

  const handleBook = async () => {
    if (!modalData) return;
    setBookingLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date: modalData.date, 
          companionId: companionMode ? companionId : undefined,
          companionName: companionMode ? companionName : undefined 
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('等待老師電話聯繫確認');
        fetchBookings();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Booking failed');
    } finally {
      setBookingLoading(false);
      setModalData(null);
    }
  };

  const renderSlot = (date: string, slotIndex: number) => {
    const slotBookings = bookings.filter(b => b.date === date && b.slot === slotIndex);
    const dayBookings = bookings.filter(b => b.date === date);
    
    // For this prototype, we'll assume the logged-in user's bookings are somehow marked. 
    // Wait, the API returns the user object. We don't have the current user's ID stored locally,
    // so we can't perfectly distinguish "Yours" vs "Booked" without the ID. 
    // We'll just display the name if it's booked.
    
    if (slotBookings.length > 0) {
      const b = slotBookings[0];
      return (
        <div key={slotIndex} className={`${styles.slot} ${styles.slotBooked}`}>
          {b.user.name} (已預約)
        </div>
      );
    }

    const availableSlots = 2 - dayBookings.length;
    const isCompanionBlocked = companionMode && (!companionId || availableSlots < 2);

    return (
      <button 
        key={slotIndex} 
        className={`${styles.slot} ${styles.slotAvailable} ${isCompanionBlocked ? styles.slotDisabled : ''}`}
        disabled={isCompanionBlocked}
        onClick={() => setModalData({ date, slot: slotIndex })}
      >
        可預約 (Available)
      </button>
    );
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className="text-2xl font-bold">Summer Class Calendar</h1>
      </div>

      <div className={styles.controls}>
        <label className={styles.companionToggle}>
          <input 
            type="checkbox" 
            checked={companionMode} 
            onChange={handleCompanionToggle} 
          />
          開啟兩人同行方案
        </label>
        
        {companionMode && (
          <div>
            <input 
              type="text" 
              placeholder="輸入同行者學生姓名" 
              className={styles.companionInput}
              value={companionName}
              onChange={e => setCompanionName(e.target.value)}
              onBlur={handleCompanionBlur}
            />
            {companionError && <div className={styles.errorText}>{companionError}</div>}
          </div>
        )}
      </div>

      <div className={styles.calendarGrid}>
        {DATES.map(date => {
          const formattedDate = format(parseISO(date), 'MM/dd (E)');
          return (
            <div key={date} className={styles.dayCard}>
              <div className={styles.dayTitle}>{formattedDate}</div>
              {renderSlot(date, 1)}
              {renderSlot(date, 2)}
            </div>
          );
        })}
      </div>

      {modalData && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} animate-fade-in`}>
            <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
            <p className="mb-6">
              確定要預約 {modalData.date} {companionMode ? '的兩人同行方案' : '的單人名額'} 嗎？
            </p>
            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setModalData(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleBook} disabled={bookingLoading}>
                {bookingLoading ? 'Processing...' : '預約 (Book)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
