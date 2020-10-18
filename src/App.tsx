import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/graphql-client";
import CitiesList from "./components/city-selector/CitySelector";
import ErrorHandler from "./components/errorHandler/ErrorHandler";
import { GraphQLError } from "graphql";
import _ from "lodash";
import "./App.scss";
import Alert from "./components/alert/Alert";

export type IError =
	| GraphQLError
	| { message: string; name: string; code?: number };

function App() {
	const [errors, setErrors] = useState<IError[]>([]);
	const [confirmations, setConfirmations] = useState<string[]>([]);

	// Add new error to display
	const addError = (err: IError) => {
		let errorsList = _.clone(errors);
		errorsList.push(err);
		setErrors(errorsList);
	};

	const removeError = (i: number) => {
		let errorsList = _.clone(errors);
		errorsList.splice(i, 1);
		setErrors(errorsList);
	};

	// Add new confirmation to display
	const addConfirmation = (text: string) => {
		let list = _.clone(confirmations);
		list.push(text);
		setConfirmations(list);
	};

	const removeConfirmation = (i: number) => {
		let list = _.clone(confirmations);
		list.splice(i, 1);
		setConfirmations(list);
	};

	return (
		<ApolloProvider client={client(addError)}>
			<ErrorHandler
				errors={errors}
				confirmations={confirmations}
				removeError={removeError}
				removeConfirmation={removeConfirmation}
			>
				<div className="App">
					<CitiesList addConfirmation={addConfirmation} />
				</div>
			</ErrorHandler>
		</ApolloProvider>
	);
}

export default App;
