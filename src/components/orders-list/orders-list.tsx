import { FC, memo } from 'react';
import { OrderCard } from '@components';
import { TOrder } from '@utils-types';

type OrdersListProps = {
  orders: TOrder[];
  onOrderClick?: (orderNumber: number) => void;
};

export const OrdersList: FC<OrdersListProps> = memo(
  ({ orders, onOrderClick }) => {
    const orderByDate = [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
      <div>
        {orderByDate.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onClick={() => onOrderClick?.(order.number)}
          />
        ))}
      </div>
    );
  }
);
