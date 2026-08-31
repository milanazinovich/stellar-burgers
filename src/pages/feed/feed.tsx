import { Preloader } from '@ui';
import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { setFeedData, fetchFeeds } from '../../services/slices/feedSlice';
import { FeedUI } from '@ui-pages';
const WS_URL = 'wss://norma.nomorepartiesco.ru/feed/all';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);
  const total = useSelector((state) => state.feed.total);
  const totalToday = useSelector((state) => state.feed.totalToday);
  const isLoading = useSelector((state) => state.feed.isLoading);

  const ingredients = useSelector(
    (state) => state.ingredients?.ingredients || []
  );

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    dispatch(fetchFeeds());

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => console.log('WebSocket подключён');

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.success) {
          dispatch(
            setFeedData({
              orders: data.orders,
              total: data.total,
              totalToday: data.totalToday
            })
          );
        }
      };

      ws.onerror = (error) => console.error('Ошибка WebSocket:', error);
      ws.onclose = () => console.log('WebSocket закрыт');
    } catch (error) {
      console.error('Не удалось подключить WebSocket:', error);
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [dispatch]);

  const ordersWithPrice = orders.map((order) => {
    const price = order.ingredients.reduce(
      (sum: number, ingredientId: string) => {
        const ingredient = ingredients.find((i) => i._id === ingredientId);
        return sum + (ingredient ? ingredient.price : 0);
      },
      0
    );
    return { ...order, price };
  });

  const readyOrders = orders
    .filter((item) => item.status === 'done')
    .slice(0, 15)
    .map((item) => item.number);

  const pendingOrders = orders
    .filter((item) => item.status === 'pending' || item.status === 'created')
    .slice(0, 15)
    .map((item) => item.number);

  const handleRefresh = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={ordersWithPrice}
      handleGetFeeds={handleRefresh}
      feedInfo={{
        feed: { total, totalToday },
        readyOrders,
        pendingOrders
      }}
    />
  );
};
