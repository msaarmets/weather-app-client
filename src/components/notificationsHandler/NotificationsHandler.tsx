import React from "react";
import Alert from "../alert/Alert";
import { IError } from "../../App";

interface Props {
	errors: IError[];
	confirmations: string[];
	removeError?: (i: number) => void;
	removeConfirmation?: (i: number) => void;
}
const ErrorHandler: React.FunctionComponent<Props> = props => {
	const isNetworkError = () => {
		if (props.errors && props.errors.length > 0) {
			return props.errors[props.errors.length - 1].name === "Network error";
		}
		return false;
	};
	return (
		<React.Fragment>
			<Alert
				errors={props.errors}
				confirmations={props.confirmations}
				removeError={props.removeError}
				removeConfirmation={props.removeConfirmation}
			/>
			{!isNetworkError() && props.children}
		</React.Fragment>
	);
};

export default ErrorHandler;
