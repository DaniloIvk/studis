import { useState, useEffect } from 'react';
import { useAuth } from '../core/context/AuthContext';
import ExamService from '../services/ExamService';
import GradeService from '../services/GradeService';
import UserService from '../services/UserService';

const userService = new UserService();
const examService = new ExamService();
const gradeService = new GradeService();

function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const [ stats, setStats ] = useState({
        totalUsers: 0,
        upcomingExams: 0,
        totalGrades: 0,
        myGrades: 0
    });
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if ( !authLoading && user){
            fetchStats();    
        }
    }, [authLoading, user]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const promises: Promise<any>[] = [];

            promises.push(examService.getAll());
            promises.push(gradeService.getAll());

            if (user?.role === 'ADMIN'){
                promises.push(userService.getAllUsers());
            }

            const results = await Promise.all(promises);

            const examsData = results[0]?.data || [];
            const gradeData = results[1]?.data || [];
            const usersData = user?.role === 'ADMIN' ? 
                (Array.isArray(results[2]) ? results[2] : (results[2]?.data || [])) 
                : [];
            
            const now = new Date();
            const upcomingExams = examsData.filter((exam:any) => 
                new Date(exam.date) > now
            ).length;

            setStats({
                totalUsers: usersData.length,
                upcomingExams,
                totalGrades: gradeData.length,
                myGrades: user?.role === 'STUDENT' ? gradeData.length : 0
            });
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50!'>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600! mb-4"></div>
                <div className="text-gray-600! font-medium">Učitavanje kontrolne table...</div>
            </div>
        );
    }

return (
    <div className='w-full h-full p-6 md:p-8 overflow-y-auto bg-gray-50! dark:bg-gray-950! transition-colors duration-300'>
      <div className='max-w-6xl mx-auto'>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900! dark:text-white! tracking-tight">Kontrolna tabla</h1>
          <p className="text-gray-500! dark:text-gray-400! mt-1">Pregled vaših aktivnosti i statistike sistema.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {user?.role === 'ADMIN' && (
            <StatCard title='Ukupno korisnika' value={stats.totalUsers} color="blue" icon="👥" />
          )}
          <StatCard title='Predstojeći ispiti' value={stats.upcomingExams} color="green" icon="📝" />
          {user?.role === 'STUDENT' && (
            <StatCard title='Moje ocene' value={stats.myGrades} color="yellow" icon="⭐" />
          )}
        </div>
        
        <div className='bg-white! dark:bg-gray-900! rounded-2xl! shadow-sm! border! border-gray-100! dark:border-gray-800! overflow-hidden'>
          <div className="p-8">
            <div className="flex items-center mb-4">
              <div className="w-2 h-8 bg-indigo-600! rounded-full! mr-4"></div>
              <h2 className='text-2xl! font-bold text-gray-800! dark:text-white!'>
                Dobrodošli nazad, {user?.firstName}!
              </h2>
            </div>
            
            <p className="text-gray-600! dark:text-gray-400! text-lg mb-6">
              Prijavljeni ste kao: <span className="font-semibold text-indigo-600! dark:text-indigo-400!">{user?.firstName} {user?.lastName}</span> 
              <span className="mx-2 text-gray-300! dark:text-gray-700!">|</span>
              Uloga: <span className="px-3 py-1 bg-gray-100! dark:bg-gray-800! rounded-full! text-sm font-medium">{user?.role}</span>
            </p>

            <div className="p-5 bg-indigo-50! dark:bg-indigo-900/30! rounded-xl! border! border-indigo-100! dark:border-indigo-900/50!">
              <div className="flex items-start">
                <span className="text-xl mr-3">💡</span>
                <p className="text-sm text-indigo-900! dark:text-indigo-200! leading-relaxed">
                  Koristite bočni meni sa leve strane kako biste pristupili sistemu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  icon: string;
}

function StatCard({ title, value, color, icon }: StatCardProps) {
  const themes = {
    blue: 'from-blue-500! to-blue-600! shadow-blue-100!',
    green: 'from-green-500! to-green-600! shadow-green-100!',
    purple: 'from-purple-500! to-purple-600! shadow-purple-100!',
    yellow: 'from-yellow-400! to-yellow-500! shadow-yellow-100!'
  };

 return (
    <div className="bg-white! dark:bg-gray-900! rounded-2xl! shadow-lg! p-6! border! border-gray-100! dark:border-gray-800! transition-transform! hover:scale-[1.02]!">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400! dark:text-gray-500! uppercase! tracking-widest! mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-black! text-gray-800! dark:text-white!">
            {value}
          </h3>
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br! ${themes[color]} rounded-2xl! flex! items-center! justify-center! text-2xl! shadow-inner!`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
export default Dashboard;