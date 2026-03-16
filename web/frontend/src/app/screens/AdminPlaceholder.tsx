import { AdminSidebar } from '../components/AdminSidebar';
import { useLocation } from 'react-router';
import { Construction } from 'lucide-react';

export function AdminPlaceholder() {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop() || 'page';
  
  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <AdminSidebar />
      
      <main className="ml-64 p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2 capitalize">
            {pageName} Section
          </h1>
          <p className="text-gray-500">This section is coming soon</p>
        </div>
      </main>
    </div>
  );
}
