import AdminAlertListener from '@/components/AdminAlertListener';

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminAlertListener />
      {children}
    </>
  );
}