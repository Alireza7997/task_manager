import styles from "@/styles/UI/InputGlassmorphismForm.module.css";

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

interface InputGlassmorphismFormProps {
	type: "password" | "text" | "button" | "submit" | "email" | "date" | "radio";
	label: string;
	placeHolder?: string;
	id: string;
	values?: string[];
	value?: any;
	default?: string;
	errors?: string[];
	reff?: React.MutableRefObject<any | undefined>;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	onRadioButtonChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const InputGlassmorphismForm: React.FC<InputGlassmorphismFormProps> = (
	props: InputGlassmorphismFormProps
) => {
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
			onFocus: focusEventHandler(props.id),
			onBlur: blurEventHandler(props.id),
			onChange: changeEventHandler(props.id),
		},
		errors: props.errors,
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
					className={`${styles.label} ${
						props.type !== "date" &&
						props.type !== "radio" &&
						styles["label-on-input"]
					}`}
					htmlFor={props.id}
					id={`_label_${props.id}`}
				>
					{props.label}
				</label>
			)}

			{/* Password input */}
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

			{/* Button, Submit input */}
			{props.type === "button" && (
				<button onClick={props.onClick}>{props.label}</button>
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
										defaultChecked
									/>
								)}
								{props.default !== value && (
									<input
										{...propsOnInput.data}
										value={value}
										id={value}
										onChange={props.onRadioButtonChange}
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
					{props.errors?.map((value) => {
						return <p className={styles.error}>{value}</p>;
					})}
				</div>
			)}
		</div>
	);
};

export default InputGlassmorphismForm;
