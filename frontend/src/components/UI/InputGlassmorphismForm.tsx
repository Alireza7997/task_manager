// =============== Styles =============== //
import styles from "@/styles/UI/InputGlassmorphismForm.module.css";

// =============== Libraries =============== //
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export interface InputGlassmorphismFormProps extends React.PropsWithChildren {
	type: "password" | "text" | "button" | "submit" | "email" | "date" | "radio";
	label: string;
	placeHolder?: string;
	id?: string;
	className?: string;
	parentClassName?: string;
	values?: string[];
	value?: string;
	default?: string;
	errors?: string[];
	readonly?: boolean;
	reff?: React.MutableRefObject<any | undefined>;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	onRadioButtonChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const InputGlassmorphismForm: React.FC<InputGlassmorphismFormProps> = (
	props
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
			className: props.className + " font-normal",
		},
		functions: {
			onFocus: () => setFocus(true),
			onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
				setFocus(e.currentTarget.value.length !== 0),
			onChange: props.onChange,
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
			} ${props.parentClassName}`}
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
							{hide && (
								<VisibilityIcon htmlColor="#000000" className="w-full h-full" />
							)}
							{!hide && (
								<VisibilityOffIcon
									htmlColor="#000000"
									className="w-full h-full"
								/>
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
				<button
					onClick={props.onClick}
					className={`${props.className ? props.className : "w-full"}`}
				>
					{props.children}
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
