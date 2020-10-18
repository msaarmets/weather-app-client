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

interface CitiesListProps {
	addConfirmation: (text: string) => void;
}

interface SelectOptions {
	value: string;
	label: string;
}

interface CountrySelectorProps {
	setCountry: (country: string) => void;
}

interface CitySelectorProps {
	setCity: (country: string) => void;
	country: string;
	city: string;
}

interface SaveButtonProps {
	country: string;
	city: string;
	setCity: (country: string) => void;
	addConfirmation: (text: string) => void;
}

export default ({ addConfirmation }: CitiesListProps) => {
	const [country, setCountry] = useState<string>("");
	const [city, setCity] = useState<string>("");

	const updateCountry = (country: string) => {
		setCountry(country);
		setCity("");
	};

	return (
		<div id="cities-list">
			<div>
				<CountrySelector setCountry={updateCountry} />
				{country.length > 1 && (
					<React.Fragment>
						<CitySelector country={country} city={city} setCity={setCity} />
						<SaveButton
							country={country}
							city={city}
							setCity={setCity}
							addConfirmation={addConfirmation}
						/>
					</React.Fragment>
				)}
			</div>
		</div>
	);
};

const CountrySelector = ({ setCountry }: CountrySelectorProps) => {
	const { loading, error, data } = useQuery<CountriesQueryResponse>(
		GetCountriesList,
		{ skip: false }
	);
	const [options, setOptions] = useState<SelectOptions[]>([]);
	const [selected, setSelected] = useState<SelectOptions>({
		value: "",
		label: ""
	});

	useEffect(() => {
		if (!loading && !error && data) {
			if (data && data.Countries) {
				const list = data.Countries.map(el => ({
					value: el.short,
					label: el.long
				}));

				const sortedList = _.sortBy(list, ["label"]);
				if (!_.isEqual(sortedList, options)) {
					setOptions(sortedList);
				}
			}
		}
	}, [loading, error, data]);

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
				}}
			/>
		</div>
	);
};

const CitySelector = ({ country, city, setCity }: CitySelectorProps) => {
	const { loading, error, data } = useQuery<CityQueryResponse>(GetCityList, {
		variables: { country },
		skip: false
	});
	const [options, setOptions] = useState<SelectOptions[]>([]);

	useEffect(() => {
		if (!loading && !error && data) {
			if (data && data.Countries && data.Countries[0].cities) {
				const list = data.Countries[0].cities.map(el => ({
					value: el,
					label: el
				}));

				if (!_.isEqual(list, options)) {
					setOptions(list);
				}
			}
		}
	}, [loading, error, data]);

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
	addConfirmation
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
		if (!city || !country) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [city, country]);

	useEffect(() => {
		if (data && data.AddCity && data.AddCity.id) {
			if (data.AddCity.id !== id) {
				addConfirmation(`${data.AddCity.name} saved successfully`);
				setId(data.AddCity.id);
				setCity("");
			}
		}
	}, [data, addConfirmation]);

	if (loading) return <Loader />;
	if (error) return null;

	return (
		<button type="button" onClick={() => addCity()} disabled={disabled}>
			Save
		</button>
	);
};
