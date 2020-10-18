import { gql } from "@apollo/client";

export default gql `
	mutation AddCity($city: String!, $country: String!){
		AddCity(city: $city, country: $country) {
			id
			name
		}
	}
  `;