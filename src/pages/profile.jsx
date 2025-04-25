import {ProfileInfo} from '@/components/ProfileInfo';
import {PasswordChange} from '@/components/PasswordChange';
import {AddressManager} from '@/components/AddressManager';
import styles from '@/styles/ProfilePage.module.css';
export default function ProfilePage() {

  return (
    <div className={styles['profile-container']}>
      <h2 className={styles['header']}>Profil</h2>
      <ProfileInfo />
      <PasswordChange />
      <AddressManager />
      <button
      style={{
        background: '#ef4444',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginTop: '20px'
      }}
      onClick={() => {
        localStorage.removeItem('user');
        window.location.href = '/';
      }}
    >
      Çıkış Yap
    </button>
    </div>
  );
}