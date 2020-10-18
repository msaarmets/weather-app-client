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
	return (
		<React.Fragment>
			{
				<Alert
					errors={props.errors}
					confirmations={props.confirmations}
					removeError={props.removeError}
					removeConfirmation={props.removeConfirmation}
				/>
			}
			{props.children}
		</React.Fragment>
	);
};

export default ErrorHandler;
