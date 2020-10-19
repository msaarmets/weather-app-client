export interface City {
		id: string
		name: string
		country: string
		temp: string
		wind: string
		humidity: string
}

export interface Country {
	short: string;
	long: string;
	Cities: [City];
}

export interface CountriesQueryResponse {
	Countries: [Country]
}

export interface CityQueryResponse {
	Countries: {
		cities: string[]
	}[]
}

export interface AddCityResponse {
	AddCity: City
}

export interface SavedCitiesQueryResponse {
	Cities: [City]
}

export interface RemoveCityResponse {
	RemoveCity: boolean;
}