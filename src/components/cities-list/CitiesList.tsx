import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import SavedCitiesQuery from "../../graphql/queries/SavedCitiesQuery";
import RemoveCityMutation from "../../graphql/mutations/RemoveCityMutation";
import {
	SavedCitiesQueryResponse,
	RemoveCityResponse,
	City
} from "../../graphql/types";
import Loader from "../Loader";
import "./CitiesList.scss";

interface Props {
	addConfirmation: (text: string) => void;
	fetchData: boolean;
}

const CitiesList = ({ addConfirmation, fetchData }: Props) => {
	const [citiesData, setCitiesData] = useState<City[]>([]);

	const { loading, error, data } = useQuery<SavedCitiesQueryResponse>(
		SavedCitiesQuery,
		{ skip: !fetchData }
	);

	const [removeCity, { loading: removeCityLoading }] = useMutation<
		RemoveCityResponse
	>(RemoveCityMutation);

	useEffect(() => {
		if (data?.Cities) {
			setCitiesData(data.Cities);
		}
	}, [data]);

	if (loading || removeCityLoading) return <Loader />;
	if (error) return null;

	if (citiesData.length === 0) {
		return (
			<div id="no-data">
				<p>Please add new city to see weather information</p>
			</div>
		);
	}

	return (
		<div id="results-table">
			<table>
				<thead>
					<th>City</th>
					<th>Temperature</th>
					<th>Wind speed</th>
					<th>Humidity</th>
					<th></th>
				</thead>
				{citiesData.map(row => {
					return (
						<tr>
							<td>{row.name}</td>
							<td>{row.temp}</td>
							<td>{row.wind}</td>
							<td>{row.humidity}</td>
							<td>
								<span
									className="remove-city"
									onClick={() => {
										removeCity({ variables: { id: row.id } })
											.then(() =>
												addConfirmation(`${row.name} deleted successfully`)
											)
											.catch(e => console.log("error:", e));
									}}
								>
									&#10006;
								</span>
							</td>
						</tr>
					);
				})}
			</table>
		</div>
	);
};

export default React.memo(CitiesList);
