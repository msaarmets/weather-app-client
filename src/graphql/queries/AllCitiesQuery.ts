import { gql } from "@apollo/client";

export default gql `
	query Countries($country: String){
		Countries(country: $country) {
			cities
		}
	}
  `;