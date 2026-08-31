import { TOrder } from '@utils-types';

export type OrderCardProps = {
  order: TOrder;
  onClick?: (orderNumber: number) => void;
};
