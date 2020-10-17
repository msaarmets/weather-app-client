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

interface SelectOptions {
	value: string;
	label: string;
}

interface countrySelectorProps {
	setCountry: (country: string) => void;
}

interface citySelectorProps {
	setCity: (country: string) => void;
	country: string;
	city: string;
}

interface saveButtonProps {
	country: string;
	city: string;
}

export default () => {
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
						<SaveButton country={country} city={city} />
					</React.Fragment>
				)}
			</div>
		</div>
	);
};

const CountrySelector = ({ setCountry }: countrySelectorProps) => {
	const { loading, error, data } = useQuery<CountriesQueryResponse>(
		GetCountriesList
	);
	const [options, setOptions] = useState<SelectOptions[]>([]);
	const [selected, setSelected] = useState<SelectOptions>({
		value: "",
		label: ""
	});

	useEffect(() => {
		if (!loading && !error && data) {
			generateOptions();
		}
	}, [loading]);
	if (loading) return <Loader />;
	if (error) return null;

	const generateOptions = () => {
		if (data && data.Countries) {
			const list = data.Countries.map(el => ({
				value: el.short,
				label: el.long
			}));

			const sortedList = _.sortBy(list, ["label"]);
			setOptions(sortedList);
		}
	};

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

const CitySelector = ({ country, city, setCity }: citySelectorProps) => {
	const { loading, error, data } = useQuery<CityQueryResponse>(GetCityList, {
		variables: { country }
	});
	const [options, setOptions] = useState<SelectOptions[]>([]);

	useEffect(() => {
		if (!loading && !error && data) {
			generateOptions();
		}
	}, [loading]);

	useEffect(() => console.log("city:", city));

	if (loading) return <Loader />;
	if (error) return null;

	const generateOptions = () => {
		if (data) {
			console.log("data:", data.Countries);
		}
		if (data && data.Countries && data.Countries[0].cities) {
			const list = data.Countries[0].cities.map(el => ({
				value: el,
				label: el
			}));
			console.log("list:", list);
			setOptions(list);
		}
	};

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

const SaveButton = ({ country, city }: saveButtonProps) => {
	const [addCity, { loading, error }] = useMutation<AddCityResponse>(
		AddCityMutation,
		{
			variables: { country, city }
		}
	);
	const [disabled, setDisabled] = useState<boolean>(false);

	useEffect(() => {
		if (!city || !country) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [city, country]);
	if (loading) return <Loader />;
	if (error) return null;

	return (
		<button type="button" onClick={() => addCity()} disabled={disabled}>
			Save
		</button>
	);
};
