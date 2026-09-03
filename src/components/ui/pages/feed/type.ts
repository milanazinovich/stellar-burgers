import { TOrder } from '@utils-types';

export type FeedUIProps = {
  orders: TOrder[];
  handleGetFeeds: () => void;
  feedInfo?: {
    feed: {
      total: number;
      totalToday: number;
    };
    readyOrders: number[];
    pendingOrders: number[];
  };
};
