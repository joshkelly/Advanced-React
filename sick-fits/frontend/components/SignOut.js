import { gql, useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    endSession
  }
`;

export default function SignOut({ children }) {
  const [signout] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <button type="button" onClick={signout}>
      Sign Out
    </button>
  );
}
