import GlassmorphismForm from "@/components/UI/GlassmorphismForm";
import InputGlassmorphismForm, {
	InputGlassmorphismFormProps,
} from "@/components/UI/InputGlassmorphismForm";
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
		<div className="screen absolute inset-0 z-50">
			<div className="full bg-[#000000bd]" onClick={props.hide}></div>
			<div className="full">
				<GlassmorphismForm addSquares={props.addSquares}>
					<h3>{props.title}</h3>
					{props.inputs.map((value) => {
						return <InputGlassmorphismForm {...value} key={value.id} />;
					})}
					<div>
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

export default Popup;
