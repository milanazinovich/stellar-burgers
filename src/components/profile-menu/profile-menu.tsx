import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/userSlice';
import { ProfileMenuUI } from '../ui/profile-menu';

export const ProfileMenu: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/', { replace: true });
    });
  };

  return (
    <ProfileMenuUI pathname={location.pathname} handleLogout={handleLogout} />
  );
};
