import LoginBackground from '../assets/images/LoginBackground.png';
import {
  formConfig,
  type LoginFormType,
} from '../validation/schemas/forms/Login.schema';
import { useNavigate } from 'react-router-dom';
import ModalForm from '../components/form/ModalForm';

function Login() {
  const navigate = useNavigate();

  function onSubmit(data: LoginFormType) {
    localStorage.setItem('user', JSON.stringify(data));
    return navigate('/about', { replace: true });
  }

  return (
    <div className='relative w-full h-full flex flex-col md:flex-row justify-stretch items-stretch'>
      <div className='w-full h-full flex justify-center items-center'>
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
