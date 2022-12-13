// =============== Components =============== //
import GlassmorphismForm from "@/components/UI/GlassmorphismForm";
import InputGlassmorphismForm, {
	InputGlassmorphismFormProps,
} from "@/components/UI/InputGlassmorphismForm";

// =============== Libraries =============== //
import { PropsWithChildren } from "react";
import Modal from "./Modal";

interface PopupProps extends PropsWithChildren {
	inputs: InputGlassmorphismFormProps[];
	addSquares: boolean;
	title: string;
	buttons: InputGlassmorphismFormProps[];
	hide: () => void;
}

const Popup: React.FC<PopupProps> = (props) => {
	return (
		<Modal hide={props.hide} zIndex={1000}>
			<div className="full">
				<GlassmorphismForm addSquares={props.addSquares}>
					<h3>{props.title}</h3>
					{props.inputs.map((value, index) => {
						return <InputGlassmorphismForm {...value} key={index} />;
					})}
					<div className="space-y-3">
						{props.buttons.map((value, index) => {
							return <InputGlassmorphismForm {...value} key={index} />;
						})}
					</div>
				</GlassmorphismForm>
			</div>
		</Modal>
	);
};

export function getInputValues(
	inputs: InputGlassmorphismFormProps[]
): Record<string, string> {
	const output: Record<string, string> = {};
	for (let i = 0; i < inputs.length; i++) {
		const input = document.getElementById(
			inputs[i].id!
		) as HTMLInputElement | null;
		if (!input) {
			continue;
		}
		output[inputs[i].id!] = input.value;
	}

	return output;
}

export default Popup;
