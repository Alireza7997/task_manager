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
	id = `_label_${id}`;
	return (event: React.FocusEvent<HTMLInputElement>) => {
		var label = document.getElementById(id) as HTMLElement;
		label.classList.remove(styles["label-on-input"]);
	};
};

const changeEventHandler = (id: string) => {
	id = `_label_${id}`;
	return (event: React.FocusEvent<HTMLInputElement>) => {
		var label = document.getElementById(id) as HTMLElement;
		if (event.target.value.length > 0) {
			label.classList.remove(styles["label-on-input"]);
		} else {
			if (document.activeElement !== event.target) {
				label.classList.add(styles["label-on-input"]);
			}
		}
	};
};

const blurEventHandler = (id: string) => {
	id = `_label_${id}`;
	return (event: React.FocusEvent<HTMLInputElement>) => {
		var label = document.getElementById(id) as HTMLElement;
		if (event.target.value.length == 0) {
			label.classList.add(styles["label-on-input"]);
		}
	};
};

interface InputGlassmorphismFormProps extends React.PropsWithChildren {
	type: "password" | "text" | "button" | "email" | "date";
	label: string;
	placeHolder?: string;
	id: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const InputGlassmorphismForm: React.FC<InputGlassmorphismFormProps> = (
	props: InputGlassmorphismFormProps
) => {
	const propsOnInput = {
		data: {
			type: props.type,
			placeholder: props.placeHolder,
			id: props.id,
		},
		functions: {
			onFocus: focusEventHandler(props.id),
			onBlur: blurEventHandler(props.id),
			onChange: changeEventHandler(props.id),
		},
	};

	return (
		<div className={styles["input-container"]}>
			{/* Label Creation */}
			{props.type !== "button" && (
				<label
					className={`${styles.label} ${
						props.type !== "date" && styles["label-on-input"]
					}`}
					htmlFor={props.id}
					id={`_label_${props.id}`}
				>
					{props.label}
				</label>
			)}

			{/* Password */}
			{props.type === "password" && (
				<div className={styles["password-input-container"]}>
					<input {...propsOnInput.data} {...propsOnInput.functions} />
					<div
						className={styles["password-view-control"]}
						onClick={showHidePassword(props.id)}
					>
						<div id={"_password_" + props.id} className={styles["eye"]}></div>
					</div>
				</div>
			)}

			{/* Text and Email input */}
			{(props.type === "text" || props.type === "email") && (
				<input {...propsOnInput.data} {...propsOnInput.functions} />
			)}

			{/* Date input */}
			{props.type === "date" && <input {...propsOnInput.data} />}

			{/* Button */}
			{props.type === "button" && (
				<button onClick={props.onClick}>{props.label}</button>
			)}
		</div>
	);
};

export default InputGlassmorphismForm;
