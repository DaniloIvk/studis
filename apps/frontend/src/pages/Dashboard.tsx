import { useState, useEffect } from 'react';
import { useAuth } from '../core/context/AuthContext';
import ExamService from '../services/ExamService';
import GradeService from '../services/GradeServices';
import ApiService from '../core/service/ApiService';

class UserService extends ApiService<any> {
    protected static basePath = '/users';
}
const userService = new UserService();

function Dashboard() {
    const { user } = useAuth();
    const [ stats, setStats ] = useState({
        totalUsers: 0,
        upcomingExams: 0,
        totalGrades: 0,
        myGrades: 0
    });
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try{
            setLoading(true);

            const promises: Promise<any>[] = []

            promises.push(ExamService.getAll());

            promises.push(GradeService.getAll());

            if (user?.role === 'ADMIN'){
                promises.push(userService.getAll());
            }

            const resluts = await Promise.all(promises);

            const examsData = resluts[0]?.data || [];
            const gradeData = resluts[1]?.data || [];
            const usersData = user?.role === 'ADMIN' ? (resluts[2]?.data || []) : [];

            const now = new Date();
            const upcomingExams = examsData.filter((exam:any) => 
                new Date(exam.date) > now
            ).length;

            setStats({
                totalUsers : usersData.length,
                upcomingExams,
                totalGrades: gradeData.length,
                myGrades: user?.role === 'STUDENT'? gradeData.length : 0
            });
        }catch(error) {
            console.error('Failed to fetch data', error);
        }finally{
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className="text-lg">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className='w-full h-full p-6 overflow-y-auto'>
            <div className='max-w-6xl mx-auto'>
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {user?.role === 'ADMIN' && (
                        <StatCard
                            title='Total Users'
                            value={stats.totalUsers}
                            color="blue"
                            icon="👥"
                        />
                    )}
                        <StatCard
                            title='Upcoming Exams'
                            value={stats.upcomingExams}
                            color="green"
                            icon="📝"
                        />  
                        {user?.role !== 'STUDENT' && (
                        <StatCard
                            title='Upcoming Exams'
                            value={stats.upcomingExams}
                            color="green"
                            icon="📝"
                        />
                        )}                  
                        {user?.role === 'STUDENT' && (
                        <StatCard
                            title='My Grades'
                            value={stats.myGrades}
                            color="yellow"
                            icon="⭐"
                        />
                        )}                  
                </div>
                
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
                    <h2 className='text-xl font-semibold mb-4'>
                        Welcome, {user?.firstName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        You are logged in as <strong>{user?.firstName}~</strong>
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Use the sidebar to navigate through the system.
                      </p>
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
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          {value}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {title}
      </h3>
    </div>
  );
}

export default Dashboard;