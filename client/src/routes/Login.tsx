import LoginForm from '../components/Login/LoginForm';
import IntroSection from '../components/Login/IntroSection';
// import './Login.css';

const Login = () => {
	return (
		<div className='login-main'>
			<IntroSection />
			<LoginForm />
		</div>
	);
};

export default Login;
