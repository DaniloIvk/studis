import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import SidebarRoutes from '../config/SidebarRoutes';
import { useAuth } from '../core/context/AuthContext';
import { useNavigate } from 'react-router-dom';

function PageSkeleton() {
  return (
    <div className='w-full h-full flex flex-row justify-stretch items-stretch content-stretch overflow-clip'>
      <Sidebar items={SidebarRoutes} />
      <div className='material bg-light dark:bg-dark text-dark dark:text-light fill-dark dark:fill-light border-dark/10 dark:border-light/10 w-full h-full flex flex-col justify-center items-center overflow-y-visible lg:overflow-hidden'>
        <Outlet />
      </div>
    </div>
  );
}

export default PageSkeleton;
