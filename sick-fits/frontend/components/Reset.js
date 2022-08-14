import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $token: String!
    $password: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });

  const [reset, { loading, data, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });

  const queryError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;

  console.log(queryError);

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log(inputs);
    const res = await reset().catch(console.error);
    resetForm();
  }

  // TODO: Check password if it meets rules prior to submitting the token
  // TODO: Token is single use and password failure results in requesting another token.
  return (
    <Form method="Post" onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>
      <DisplayError error={error || queryError} />
      <fieldset disabled={loading} aria-busy={loading}>
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success your password has been reset!</p>
        )}
        <label htmlFor="email">
          Email
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={inputs.email || ''}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password || ''}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Request Reset</button>
      </fieldset>
    </Form>
  );
}
