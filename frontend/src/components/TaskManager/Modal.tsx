// =============== Libraries =============== //
import { createPortal } from "react-dom";

interface ModalProps extends React.PropsWithChildren {
	hide: () => void;
}

const Modal = (props: ModalProps) => {
	return createPortal(
		<div className="screen fixed inset-0 z-[1000]">
			<div className="full bg-[#000000bd]" onClick={props.hide}></div>
			{props.children}
		</div>,
		document.getElementsByTagName("body")[0]
	);
};

export default Modal;
