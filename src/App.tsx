import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/graphql-client";
import CitiesList from "./components/city-selector/CitySelector";
import ErrorHandler from "./components/errorHandler/ErrorHandler";
import { GraphQLError } from "graphql";
import _ from "lodash";
import "./App.scss";

export type IError =
	| GraphQLError
	| { message: string; name: string; code?: number };

function App() {
	const [errors, setErrors] = useState<IError[]>([]);

	// Add new error to display
	const addError = (err: IError) => {
		let errorsList = _.clone(errors);
		errorsList.push(err);
		setErrors(errorsList);
	};

	return (
		<ApolloProvider client={client(addError)}>
			<ErrorHandler errors={errors}>
				<div className="App">
					<CitiesList />
				</div>
			</ErrorHandler>
		</ApolloProvider>
	);
}

export default App;
