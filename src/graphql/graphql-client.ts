import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { IError } from "../App";


type addError = (err: IError) => void;

const errorLink = (addError:addError) => {
  
  return onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach((e) => {
      console.log(
        `[GraphQL error]: Message: ${e.message}, Location: ${e.locations}, Path: ${e.path}`,
      );
      addError(e);
      });

  if (networkError){
    console.log("[Network error]: ", networkError);
    addError({message: `[Network error]: ${networkError}`, name: "Network error"});
  }
});
}

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

const link = (addError:addError) => from([errorLink(addError), httpLink]);

const client = (addError:addError) => new ApolloClient({
  link: link(addError),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: { errorPolicy: 'ignore' },
  },
});

export default (addError: addError) => client(addError);