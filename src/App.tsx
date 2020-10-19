import React, { useState, useCallback } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/graphql-client";
import CitySelector from "./components/city-selector/CitySelector";
import CitiesList from "./components/cities-list/CitiesList";
import Notifications from "./components/notificationsHandler/NotificationsHandler";
import { GraphQLError } from "graphql";
import _ from "lodash";
import "./App.scss";

export type IError =
	| GraphQLError
	| { message: string; name: string; code?: number };

function App() {
	const [errors, setErrors] = useState<IError[]>([]);
	const [confirmations, setConfirmations] = useState<string[]>([]);
	const [refetchData, setRefetchData] = useState<boolean>(true);

	// Add new error to display
	const addError = useCallback((err: IError) => {
		setErrors(errors => [...errors, err]);
		setRefetchData(false);
	}, []);

	const removeError = useCallback(
		(i: number) => {
			let errorsList = _.clone(errors);
			errorsList.splice(i, 1);
			setErrors(errorsList);
			setRefetchData(false);
		},
		[errors]
	);

	// Add new confirmation to display
	const addConfirmation = useCallback((text: string) => {
		setConfirmations(confirmations => [...confirmations, text]);
		setRefetchData(true);
	}, []);

	const removeConfirmation = useCallback(
		(i: number) => {
			let list = [...confirmations];
			list.splice(i, 1);
			setConfirmations(list);
			setRefetchData(false);
		},
		[confirmations]
	);

	return (
		<ApolloProvider client={client(addError)}>
			<Notifications
				errors={errors}
				confirmations={confirmations}
				removeError={removeError}
				removeConfirmation={removeConfirmation}
			>
				<div className="App">
					<CitySelector addConfirmation={addConfirmation} />
					<CitiesList
						addConfirmation={addConfirmation}
						fetchData={refetchData}
					/>
				</div>
			</Notifications>
		</ApolloProvider>
	);
}

export default App;
