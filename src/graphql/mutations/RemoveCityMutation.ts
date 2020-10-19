import { gql } from "@apollo/client";

export default gql `
	mutation RemoveCity($id: ID!){
		RemoveCity(id: $id)
	}
  `;