import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  const [userName, setUserName] = useState(''); // <-- Обратите внимание: userName
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name: userName, email, password })); // <-- В API передаем name
  };

  return (
    <RegisterUI
      errorText={''}
      email={email}
      setEmail={setEmail}
      userName={userName}
      setUserName={setUserName}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
