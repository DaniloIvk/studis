import { useState, useEffect } from 'react';
import ExamService, { type Exam } from '../services/ExamService';
import { useAuth } from '../core/context/AuthContext';

function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const canManageExams = user?.role === 'PROFESSOR' || user?.role === 'ADMIN';

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await ExamService.getAll();
      setExams(response.data);
    } catch (err: any) {
      setError(err.error || 'Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;

    try {
      await ExamService.delete(id);
      fetchExams();
    } catch (err: any) {
      setError(err.error || 'Failed to delete exam');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading exams...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Exams</h1>
          {canManageExams && (
            <button
              onClick={() => {/* TODO: Open create modal */}}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Exam
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {exams.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No exams found
          </div>
        ) : (
          <div className="grid gap-4">
            {exams.map((exam) => (
              <div 
                key={exam.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
                    {exam.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{exam.description}</p>
                    )}
                    <div className="text-sm text-gray-500 space-y-1">
                      {exam.course && (
                        <p>
                          <strong>Course:</strong> {exam.course.name} ({exam.course.index})
                        </p>
                      )}
                      <p>
                        <strong>Date:</strong> {new Date(exam.date).toLocaleString()}
                      </p>
                      {exam.createdBy && (
                        <p>
                          <strong>Created by:</strong> {exam.createdBy.firstName} {exam.createdBy.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  {canManageExams && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {/* TODO: Open edit modal */}}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Exams;