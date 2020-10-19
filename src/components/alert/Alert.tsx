import React from "react";
import "./Alert.scss";
import { IError } from "../../App";

interface Props {
	errors?: IError[];
	warnings?: String[];
	confirmations?: String[];
	removeError?: (i: number) => void;
	removeConfirmation?: (i: number) => void;
}
export default ({
	errors,
	warnings,
	confirmations,
	removeConfirmation,
	removeError
}: Props) => {
	if (
		errors?.length === 0 &&
		warnings?.length === 0 &&
		confirmations?.length === 0
	)
		return null;

	return (
		<div id="alert-block">
			{confirmations && confirmations.length > 0 && removeConfirmation && (
				<React.Fragment>
					{confirmations.map((el, i) => (
						<div className="confirmation">
							<ul>
								<li key={i}>
									{el}{" "}
									<span onClick={() => removeConfirmation(i)}>&#10006;</span>
								</li>
							</ul>
						</div>
					))}
				</React.Fragment>
			)}
			{warnings && warnings.length > 0 && (
				<React.Fragment>
					{warnings.map((el, i) => (
						<div className="warning">
							<ul>
								<li key={i}>
									{el} <span>&#10006;</span>
								</li>
							</ul>
						</div>
					))}
				</React.Fragment>
			)}
			{errors && errors.length > 0 && removeError && (
				<React.Fragment>
					{errors.map((el, i) => (
						<div className="error">
							<ul>
								<li key={i}>
									{el.message}{" "}
									<span onClick={() => removeError(i)}>&#10006;</span>
								</li>
							</ul>
						</div>
					))}
				</React.Fragment>
			)}
		</div>
	);
};
