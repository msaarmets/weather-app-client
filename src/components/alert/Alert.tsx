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
				<div className="confirmation">
					<ul>
						{confirmations.map((el, i) => (
							<li key={i}>
								{el} <span onClick={() => removeConfirmation(i)}>&#10006;</span>
							</li>
						))}
					</ul>
				</div>
			)}
			{warnings && warnings.length > 0 && (
				<div className="warning">
					<ul>
						{warnings.map((el, i) => (
							<li key={i}>
								{el} <span>&#10006;</span>
							</li>
						))}
					</ul>
				</div>
			)}
			{errors && errors.length > 0 && removeError && (
				<div className="error">
					<ul>
						{errors.map((el, i) => (
							<li key={i}>
								{el.message}{" "}
								<span onClick={() => removeError(i)}>&#10006;</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
