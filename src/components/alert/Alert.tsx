import React from "react";
import "./Alert.scss";
import { IError } from "../../App";

interface Props {
	errors?: IError[];
	warnings?: String[];
	confirmations?: String[];
}
export default ({ errors, warnings, confirmations }: Props) => (
	<div id="alert-block">
		{confirmations && confirmations.length > 0 && (
			<div className="confirmation">
				<ul>
					{confirmations.map((el, i) => (
						<li key={i}>{el}</li>
					))}
				</ul>
			</div>
		)}
		{warnings && warnings.length > 0 && (
			<div className="warning">
				<ul>
					{warnings.map((el, i) => (
						<li key={i}>{el}</li>
					))}
				</ul>
			</div>
		)}
		{errors && errors.length > 0 && (
			<div className="error">
				<ul>
					{errors.map((el, i) => (
						<li key={i}>{el.message}</li>
					))}
				</ul>
			</div>
		)}
	</div>
);
