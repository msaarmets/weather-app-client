import { gql } from "@apollo/client";

export default gql `
	query Cities{
			Cities{
			id
			name
			country
			temp
			wind
			humidity
		}
	}
  `;