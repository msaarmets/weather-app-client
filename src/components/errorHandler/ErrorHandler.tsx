import React from "react";
import Alert from "../alert/Alert";
import { IError } from "../../App";

interface Props {
	errors: IError[];
}
const ErrorHandler: React.FunctionComponent<Props> = props => {
	// console.log("errors:", props.errors);
	return (
		<React.Fragment>
			{props.errors.length > 0 && <Alert errors={props.errors} />}
			{props.children}
		</React.Fragment>
	);
};

export default ErrorHandler;
