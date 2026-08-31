import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';

import { fetchUser } from '../../services/slices/userSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import styles from './app.module.css';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, [dispatch]);

  const background = location.state && location.state.background;

  const handleCloseModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Routes>
        <Route path='/' element={null} />
        <Route path='/feed' element={null} />
        <Route path='/login' element={null} />
        <Route path='/register' element={null} />
        <Route path='/forgot-password' element={null} />
        <Route path='/reset-password' element={null} />
        <Route path='/profile' element={null} />
        <Route path='/profile/orders' element={null} />

        <Route
          path='/ingredients/:id'
          element={
            background ? (
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            ) : (
              <IngredientDetails />
            )
          }
        />
        <Route
          path='/feed/:number'
          element={
            background ? (
              <Modal title='Детали заказа' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            ) : (
              <OrderInfo />
            )
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              {background ? (
                <Modal title='Детали заказа' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              ) : (
                <OrderInfo />
              )}
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
