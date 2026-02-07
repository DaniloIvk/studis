import LoginBackground from '../assets/images/LoginBackground.png';
import {
  formConfig,
  type LoginFormType,
} from '../validation/schemas/forms/Login.schema';
import { useNavigate } from 'react-router-dom';
import ModalForm from '../components/form/ModalForm';
import { useState } from 'react';
import { useAuth } from '../core/context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  async function onSubmit(data: LoginFormType) {
    setError('');

    if (!data.email || !data.password) {
      setError('Email and password are required');
      return;
    }

    try {
      await login(data.email, data.password);
      navigate('/', {replace: true});
    } catch(err: any) {
      setError(err.error || 'Login failed');
      throw err;
    }
  }

    return (
    <div className='relative w-full h-full flex flex-col md:flex-row justify-stretch items-stretch'>
      <div className='w-full h-full flex justify-center items-center'>
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10">
            {error}
          </div>
        )}
        <ModalForm
          size='small'
          onSubmit={onSubmit}
          submitButtonText='login'
          {...formConfig}
          showSubmit
          hideCloseButton
        />
      </div>
      <div className='w-full md:w-2/5 h-1/3 md:h-full'>
        <img
          src={LoginBackground}
          alt=''
          className='w-full h-full object-cover md:object-cover object-[30%] md:object-center dark:opacity-60'
        />
      </div>
    </div>
  );
}

export default Login;
