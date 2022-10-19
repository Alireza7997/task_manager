// =============== Components =============== //
import GlassmorphismForm from "@/components/UI/GlassmorphismForm";
import InputGlassmorphismForm, {
	InputGlassmorphismFormProps,
} from "@/components/UI/InputGlassmorphismForm";

// =============== Libraries =============== //
import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

interface PopupProps extends PropsWithChildren {
	inputs: InputGlassmorphismFormProps[];
	addSquares: boolean;
	title: string;
	buttons: InputGlassmorphismFormProps[];
	hide: () => void;
}

const Popup: React.FC<PopupProps> = (props) => {
	return createPortal(
		<div className="screen fixed inset-0 z-50">
			<div className="full bg-[#000000bd]" onClick={props.hide}></div>
			<div className="full">
				<GlassmorphismForm addSquares={props.addSquares}>
					<h3>{props.title}</h3>
					{props.inputs.map((value) => {
						return <InputGlassmorphismForm {...value} key={value.id} />;
					})}
					<div className="space-y-3">
						{props.buttons.map((value) => {
							return <InputGlassmorphismForm {...value} key={value.id} />;
						})}
					</div>
				</GlassmorphismForm>
			</div>
		</div>,
		document.getElementsByTagName("body")[0]
	);
};

export function getInputValues(
	inputs: InputGlassmorphismFormProps[]
): Record<string, string> {
	const output: Record<string, string> = {};
	for (let i = 0; i < inputs.length; i++) {
		const input = document.getElementById(
			inputs[i].id
		) as HTMLInputElement | null;
		if (!input) {
			continue;
		}
		output[inputs[i].id] = input.value;
	}

	return output;
}

export default Popup;
