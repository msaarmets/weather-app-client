import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import GetCountriesList from "../../graphql/queries/CountriesListQuery";
import GetCityList from "../../graphql/queries/AllCitiesQuery";
import AddCityMutation from "../../graphql/mutations/AddCityMutation";
import {
	CountriesQueryResponse,
	CityQueryResponse,
	AddCityResponse
} from "../../graphql/types";
import Loader from "../Loader";
import Select from "react-select";
import _ from "lodash";
import "./CitySelector.scss";

interface Props {
	addConfirmation: (text: string) => void;
}

interface SelectOptions {
	value: string;
	label: string;
}

interface CountrySelectorProps {
	setCountry: (country: string) => void;
	setFetchCities: (fetch: boolean) => void;
}

interface CitySelectorProps {
	setCity: (country: string) => void;
	country: string;
	city: string;
	fetchData: boolean;
}

interface SaveButtonProps {
	country: string;
	city: string;
	setCity: (country: string) => void;
	addConfirmation: (text: string) => void;
	setFetchCities: (fetch: boolean) => void;
}

export default ({ addConfirmation }: Props) => {
	const [country, setCountry] = useState<string>("");
	const [city, setCity] = useState<string>("");
	const [fetchCities, setFetchCities] = useState<boolean>(false);

	const updateCountry = (country: string) => {
		setCountry(country);
		setCity("");
	};

	return (
		<div id="cities-list">
			<div>
				<CountrySelector
					setCountry={updateCountry}
					setFetchCities={setFetchCities}
				/>
				{country.length > 1 && (
					<React.Fragment>
						<CitySelector
							country={country}
							city={city}
							setCity={setCity}
							fetchData={fetchCities}
						/>
						<SaveButton
							country={country}
							city={city}
							setCity={setCity}
							setFetchCities={setFetchCities}
							addConfirmation={addConfirmation}
						/>
					</React.Fragment>
				)}
			</div>
		</div>
	);
};

const CountrySelector = ({
	setCountry,
	setFetchCities
}: CountrySelectorProps) => {
	const [fetchData, setFetchData] = useState<boolean>(true);

	const { loading, error, data } = useQuery<CountriesQueryResponse>(
		GetCountriesList,
		{ skip: !fetchData }
	);

	const [options, setOptions] = useState<SelectOptions[]>([]);
	const [selected, setSelected] = useState<SelectOptions>({
		value: "",
		label: ""
	});

	useEffect(() => {
		if (!loading && !error && data) {
			if (data && data.Countries) {
				// Generate options object
				const list = data.Countries.map(el => ({
					value: el.short,
					label: el.long
				}));

				const sortedList = _.sortBy(list, ["label"]);
				if (!_.isEqual(sortedList, options)) {
					setOptions(sortedList);
					// No need to fetch the data again
					setFetchData(false);
				}
			}
		}
	}, [loading, error, data, options]);

	if (loading) return <Loader />;
	if (error) return null;

	return (
		<div>
			<label>Country</label>
			<Select
				options={options}
				value={selected ? selected : undefined}
				onChange={option => {
					setSelected(option as SelectOptions);
					setCountry((option as SelectOptions).value);
					setFetchCities(true);
				}}
			/>
		</div>
	);
};

const CitySelector = ({
	country,
	city,
	setCity,
	fetchData
}: CitySelectorProps) => {
	const { loading, error, data } = useQuery<CityQueryResponse>(GetCityList, {
		variables: { country },
		skip: !fetchData
	});
	const [options, setOptions] = useState<SelectOptions[]>([]);

	useEffect(() => {
		if (!loading && !error && data) {
			if (data && data.Countries && data.Countries[0].cities) {
				const list = data.Countries[0].cities.map(el => ({
					value: el,
					label: el
				}));

				// Update the cities list only if new data is received
				if (!_.isEqual(list, options)) {
					setOptions(list);
				}
			}
		}
	}, [loading, error, data, options]);

	if (loading) return <Loader />;
	if (error) return null;

	return (
		<div>
			<label>City</label>
			<Select
				options={options}
				value={city !== "" ? { value: city, label: city } : undefined}
				onChange={option => {
					setCity((option as SelectOptions).value);
				}}
			/>
		</div>
	);
};

const SaveButton = ({
	country,
	city,
	setCity,
	addConfirmation,
	setFetchCities
}: SaveButtonProps) => {
	const [addCity, { data, loading, error }] = useMutation<AddCityResponse>(
		AddCityMutation,
		{
			variables: { country, city }
		}
	);
	const [disabled, setDisabled] = useState<boolean>(false);
	const [id, setId] = useState<string>("");

	useEffect(() => {
		// If city or country is not yet selected disable "Save" button
		if (!city || !country) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [city, country]);

	useEffect(() => {
		// If saving the city to the database was successful
		if (data && data.AddCity && data.AddCity.id) {
			if (data.AddCity.id !== id) {
				addConfirmation(`${data.AddCity.name} saved successfully`);
				setId(data.AddCity.id);
				setCity("");
			}
		}
	}, [data, addConfirmation, id, setId, setCity]);

	useEffect(() => {
		if (error) {
			setDisabled(true);
		}
	}, [error]);

	if (loading) return <Loader />;

	return (
		<button
			type="button"
			onClick={() => {
				addCity().catch(e => console.error("Error:", e));
				setFetchCities(false);
			}}
			disabled={disabled}
		>
			Save
		</button>
	);
};
