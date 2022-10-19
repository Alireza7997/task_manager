// =============== Styles =============== //
import styles from "@/styles/UI/InputGlassmorphismForm.module.css";

// =============== Libraries =============== //
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export interface InputGlassmorphismFormProps {
	type: "password" | "text" | "button" | "submit" | "email" | "date" | "radio";
	label: string;
	placeHolder?: string;
	id: string;
	values?: string[];
	value?: any;
	default?: string;
	errors?: string[];
	readonly?: boolean;
	reff?: React.MutableRefObject<any | undefined>;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	onRadioButtonChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const InputGlassmorphismForm: React.FC<InputGlassmorphismFormProps> = (
	props: InputGlassmorphismFormProps
) => {
	const [hide, setHide] = useState(true);
	const [focus, setFocus] = useState(true);
	const propsOnInput = {
		data: {
			type: props.type,
			placeholder: props.placeHolder,
			id: props.id,
			value: props.value,
			name: props.id,
			ref: props.reff,
		},
		functions: {
			onFocus: () => setFocus(true),
			onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
				setFocus(e.currentTarget.value.length !== 0),
		},
		errors: props.errors,
	};

	const showHidePassword = (event: React.MouseEvent<HTMLDivElement>) => {
		setHide(!hide);
	};

	return (
		<div
			className={`${styles["input-container"]} ${
				props.type === "radio" && styles["radio-button-container"]
			}`}
		>
			{/* Label */}
			{props.type !== "button" && (
				<label
					className={`${styles.label} ${!focus && styles["label-in-input"]}`}
					htmlFor={props.id}
					id={`_label_${props.id}`}
				>
					{props.label}
				</label>
			)}

			{/* Password input */}
			{props.type === "password" && (
				<div className={styles["password-input-container"]}>
					<input
						{...propsOnInput.data}
						{...propsOnInput.functions}
						type={`${(hide && "password") || (!hide && "text")}`}
						readOnly={props.readonly}
					/>
					<div
						className={styles["password-view-control"]}
						onClick={showHidePassword}
					>
						<div id={props.id} className={styles["eye"]}>
							{hide && <AiFillEye color="black" className="w-full h-full" />}
							{!hide && (
								<AiFillEyeInvisible color="black" className="w-full h-full" />
							)}
						</div>
					</div>
				</div>
			)}

			{/* Text and Email input */}
			{(props.type === "text" || props.type === "email") && (
				<input
					{...propsOnInput.data}
					{...propsOnInput.functions}
					readOnly={props.readonly}
				/>
			)}

			{/* Date input */}
			{props.type === "date" && (
				<input {...propsOnInput.data} readOnly={props.readonly} />
			)}

			{/* Button, Submit input */}
			{props.type === "button" && (
				<button onClick={props.onClick} className="w-full">
					{props.label}
				</button>
			)}

			{/* Radio Button input */}
			{props.type === "radio" && (
				<div className="columns-2 pt-2 space-y-2">
					{props.values?.map<React.ReactNode>((value) => {
						return (
							<div className="w-full flex flex-row" key={value}>
								{props.default === value && (
									<input
										{...propsOnInput.data}
										value={value}
										id={value}
										onChange={props.onRadioButtonChange}
										readOnly={props.readonly}
										defaultChecked
									/>
								)}
								{props.default !== value && (
									<input
										{...propsOnInput.data}
										value={value}
										id={value}
										onChange={props.onRadioButtonChange}
										readOnly={props.readonly}
									/>
								)}
								<label htmlFor={value}>{value}</label>
							</div>
						);
					})}
				</div>
			)}

			{/* Errors */}
			{props.errors && props.errors.length !== 0 && (
				<div className={styles["error-box"]}>
					{props.errors?.map((value, i) => {
						return (
							<p className={styles.error} key={i}>
								{value}
							</p>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default InputGlassmorphismForm;
