import React from "react";
import styles from "../../styles/UI/InputGlassmorphismForm.module.css";

const show_hide_password = (id: string) => {
	return (event: React.MouseEvent<HTMLElement>) => {
		var input = document.getElementById(id) as HTMLElement;
		if (input.getAttribute("type") === "password") {
			(document.getElementById("_password_" + id) as HTMLElement).classList.add(
				styles["no-eye"]
			);
			input.setAttribute("type", "text");
		} else {
			(
				document.getElementById("_password_" + id) as HTMLElement
			).classList.remove(styles["no-eye"]);
			input.setAttribute("type", "password");
		}
	};
};

interface InputGlassmorphismFormProps extends React.PropsWithChildren {
	type: "password" | "text" | "button" | "email";
	label: string;
	placeHolder: string;
	id: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const InputGlassmorphismForm: React.FC<InputGlassmorphismFormProps> = (
	props: InputGlassmorphismFormProps
) => {
	return (
		<div className={styles["input-container"]}>
			{/* Label Creation */}
			{props.type !== "button" && (
				<label htmlFor={props.id}>{props.label}</label>
			)}

			{/* Password */}
			{props.type === "password" && (
				<div className={styles["password-input-container"]}>
					<input
						type={props.type}
						placeholder={props.placeHolder}
						id={props.id}
					/>
					<div
						className={styles["password-view-control"]}
						onClick={show_hide_password(props.id)}
					>
						<div id={"_password_" + props.id} className={styles["eye"]}></div>
					</div>
				</div>
			)}

			{/* Text input */}
			{props.type === "text" && (
				<input
					type={props.type}
					placeholder={props.placeHolder}
					id={props.id}
				/>
			)}

			{/* Email input */}
			{props.type === "email" && (
				<input
					type={props.type}
					placeholder={props.placeHolder}
					id={props.id}
				/>
			)}

			{/* Button */}
			{props.type === "button" && (
				<button onClick={props.onClick}>{props.label}</button>
			)}
		</div>
	);
};

export default InputGlassmorphismForm;
