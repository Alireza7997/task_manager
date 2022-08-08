import React from "react";
import styles from "../../styles/UI/InputGlassmorphismForm.module.css";

const showHidePassword = (id: string) => {
	return (event: React.MouseEvent<HTMLDivElement>) => {
		var input = document.getElementById(id) as HTMLElement;
		var passwordBtn = document.getElementById(`_password_${id}`) as HTMLElement;
		if (input.getAttribute("type") === "password") {
			passwordBtn.classList.add(styles["no-eye"]);
			input.setAttribute("type", "text");
		} else {
			passwordBtn.classList.remove(styles["no-eye"]);
			input.setAttribute("type", "password");
		}
	};
};

const focusEventHandler = (id: string) => {
	return (event: React.FocusEvent<HTMLInputElement>) => {
		var label = document.getElementById(`_label_${id}`) as HTMLElement;
		label.classList.remove(styles["label-on-input"]);
	};
};

const blurEventHandler = (id: string) => {
	return (event: React.FocusEvent<HTMLInputElement>) => {
		var label = document.getElementById(`_label_${id}`) as HTMLElement;
		if (event.target.value.length == 0) {
			label.classList.add(styles["label-on-input"]);
		}
	};
};

interface InputGlassmorphismFormProps extends React.PropsWithChildren {
	type: "password" | "text" | "button" | "email";
	label: string;
	placeHolder?: string;
	id: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const InputGlassmorphismForm: React.FC<InputGlassmorphismFormProps> = (
	props: InputGlassmorphismFormProps
) => {
	const propsOnInput = {
		type: props.type,
		placeholder: props.placeHolder,
		id: props.id,
		onFocus: focusEventHandler(props.id),
		onBlur: blurEventHandler(props.id),
	};

	return (
		<div className={styles["input-container"]}>
			{/* Label Creation */}
			{props.type !== "button" && (
				<label
					className={`${styles.label} ${styles["label-on-input"]}`}
					htmlFor={props.id}
					id={`_label_${props.id}`}
				>
					{props.label}
				</label>
			)}

			{/* Password */}
			{props.type === "password" && (
				<div className={styles["password-input-container"]}>
					<input {...propsOnInput} />
					<div
						className={styles["password-view-control"]}
						onClick={showHidePassword(props.id)}
					>
						<div id={"_password_" + props.id} className={styles["eye"]}></div>
					</div>
				</div>
			)}

			{/* Text input */}
			{props.type === "text" && <input {...propsOnInput} />}

			{/* Email input */}
			{props.type === "email" && <input {...propsOnInput} />}

			{/* Button */}
			{props.type === "button" && (
				<button onClick={props.onClick}>{props.label}</button>
			)}
		</div>
	);
};

export default InputGlassmorphismForm;
