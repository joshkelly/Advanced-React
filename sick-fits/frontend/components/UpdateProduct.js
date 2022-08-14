import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import Head from 'next/head';
import Router from 'next/router';
import DisplayError from './ErrorMessage';
import ProductStyles from './styles/ProductStyles';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import { ALL_PRODUCTS_QUERY } from './Products';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      id
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String!
    $description: String!
    $price: Int!
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function UpdateProduct({ id }) {
  // 1. Get the existing product
  const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id,
    },
  });

  // const { inputs, handleChange, resetForm, clearForm } = useForm({
  //   name: Product.name,
  //   price: Product.price,
  //   description: Product.description,
  // });

  // 2. Get the mutation to update the product
  const [
    updateProduct,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  const placeholderProduct = {
    name: '',
    price: 0,
    description: '',
  };

  const { inputs, handleChange } = useForm(data?.Product || placeholderProduct);

  // 3. Form to handle the updates

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError />;

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await updateProduct({
          variables: {
            id,
            name: inputs.name,
            price: inputs.price,
            description: inputs.description,
          },
        }).catch(console.error);

        // TODO: Handle Submit!!!
        // const res = await createProduct();
        // clearForm();
        // Router.push({
        //   pathname: `/product/${res.data.createProduct.id}`,
        // });
      }}
    >
      <DisplayError error={updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        {/* <div>
          Image
          <img
            src={inputs.photo.image.publicUrlTransformed}
            alt={inputs.photo.altText}
          />
        </div> */}
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">+ Update Product</button>
      </fieldset>
    </Form>
  );
}
