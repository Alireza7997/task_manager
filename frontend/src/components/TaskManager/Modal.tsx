// =============== Libraries =============== //
import { createPortal } from "react-dom";

interface ModalProps extends React.PropsWithChildren {
	hide: () => void;
	zIndex: number;
}

const Modal = (props: ModalProps) => {
	return createPortal(
		<div className="screen fixed inset-0" style={{ zIndex: props.zIndex }}>
			<div className="full bg-[#000000bd]" onClick={props.hide}></div>
			{props.children}
		</div>,
		document.getElementsByTagName("body")[0]
	);
};

export default Modal;
