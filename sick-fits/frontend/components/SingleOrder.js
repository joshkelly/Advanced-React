import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

export const SINGLE_ORDERS_QUERY = gql`
  query SINGLE_ORDERS_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      charge
      items {
        name
        price
        description
        id
        quantity
        photo {
          altText
          image {
            publicUrlTransformed
          }
        }
      }
      total
      user {
        id
        name
      }
    }
  }
`;

export default function SingleOrder({ id }) {
  const { data, error, loading } = useQuery(SINGLE_ORDERS_QUERY, {
    variables: {
      id,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;
  const { order } = data;
  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits - {order.id}</title>
      </Head>
      <p>
        <span>Order Id:</span>
        <span>{order.id}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{order.charge}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(order.total)}</span>
      </p>

      <div className="items">
        {order.items.map((item) => (
          <div key={item.id} className="order-item">
            <img src={item.photo.image.publicUrlTransformed} alt={item.title} />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Sub Total: {formatMoney(item.price * item.quantity)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}
