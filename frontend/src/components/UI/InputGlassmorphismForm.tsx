import React from "react";
import styles from "./InputGlassmorphismForm.module.css";

const show_hide_password = (event: React.MouseEvent<HTMLElement>) => {
	var input = document.getElementById("password") as HTMLElement;
	if (input.getAttribute("type") == "password") {
		event.currentTarget.classList.add(styles["password-visible"]);
		input.setAttribute("type", "text");
	} else {
		event.currentTarget.classList.remove(styles["password-visible"]);
		input.setAttribute("type", "password");
	}
};

interface InputGlassmorphismFormProps {
	type: "password" | "text" | "button";
	label: string;
	placeHolder: string;
	id: string;
}

const InputGlassmorphismForm: React.FC<InputGlassmorphismFormProps> = (
	props: InputGlassmorphismFormProps
) => {
	return (
		<div className={styles["input-container"]}>
			{/* Label Creation */}
			{props.type != "button" && (
				<label htmlFor={props.id}>{props.label}</label>
			)}

			{/* Password */}
			{props.type == "password" && (
				<div className={styles["password-input-container"]}>
					<input
						type={props.type}
						placeholder={props.placeHolder}
						id={props.id}
					/>
					<a
						className={styles["password-view-control"]}
						onClick={show_hide_password}
					></a>
				</div>
			)}

			{/* Text input */}
			{props.type == "text" && (
				<input
					type={props.type}
					placeholder={props.placeHolder}
					id={props.id}
				/>
			)}

			{/* Button */}
			{props.type == "button" && <button>{props.label}</button>}
		</div>
	);
};

export default InputGlassmorphismForm;
