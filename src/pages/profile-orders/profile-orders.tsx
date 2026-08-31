import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchHistoryOrders } from '../../services/slices/historyOrdersSlice';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.historyOrders.orders);

  useEffect(() => {
    dispatch(fetchHistoryOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
