import GlassmorphismForm from "../UI/GlassmorphismForm";
import InputGlassmorphismForm from "../UI/InputGlassmorphismForm";

const Login: React.FC = () => {
	return (
		<GlassmorphismForm>
			<h3>welcome</h3>
			<InputGlassmorphismForm
				id="username"
				label="username"
				placeHolder="email or phone"
				type="text"
			/>
			<InputGlassmorphismForm
				id="password"
				label="password"
				placeHolder="password"
				type="password"
			/>
			<InputGlassmorphismForm
				label="Login"
				type="button"
				id=""
				placeHolder=""
			/>
		</GlassmorphismForm>
	);
};

export default Login;
