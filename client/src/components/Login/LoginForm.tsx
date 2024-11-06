import '../../styles/LoginForm.scss';
import React from 'react';
import tokenService from '../../services/token.js';
import { useAppDispatch } from '../../hooks.js';
import { clearTodos } from '../../store/todoSlice.js';
import { useNavigate, Link } from 'react-router-dom';
import loginService from '../../services/login.js';

// Main login form component
const Form = () => {
	// State management for form data and error messages
	const [formData, setFormData] = React.useState({ email: '', password: '' });
	const [errorMessage, setError] = React.useState('');

	// Hooks for navigation and Redux dispatch
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	// Handle input changes in form fields
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prevFormData) => {
			return {
				...prevFormData,
				// Update the specific field (email or password)
				[e.target.name]: e.target.value,
			};
		});
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// Prevent default form submission behavior
		e.preventDefault();
		console.log('Form data:', formData);

		// Validate that both email and password fields are filled
		if (!formData.email || !formData.password) {
			setError('All fields are required.');
			return;
		}

		try {
			// Clear existing todos before login
			dispatch(clearTodos());

			// Attempt to log in user
			const response = await loginService.loginUser(formData);

			if (response.token) {
				// Store user data in localStorage and set token
				window.localStorage.setItem('loggedTodoappUser', JSON.stringify(response));
				tokenService.setToken(response.token);
				// Redirect to upcoming todos page
				navigate('/upcoming');
			} else {
				setError('Invalid credentials');
			}
		} catch (error) {
			console.error('Error in handleSubmit:', error);
			setError('Login failed. Please try again.');
		}
	};

	return (
		<div className='right-side'>
			<form className='login-form' onSubmit={handleSubmit}>
				<div className='login-form-top-text'>
					<h2 className='login-form-title'>Login</h2>
					<p className='welcome-back'>Nice to see you!</p>
				</div>

				<div className='login-form-item'>
					<label htmlFor='login-email'>Email</label>
					<input
						className='login-input'
						type='text'
						id='login-email'
						placeholder='Enter your email'
						onChange={handleChange}
						name='email'
						value={formData.email}
					/>
				</div>

				<div className='login-form-item'>
					<label htmlFor='login-password'>Password</label>
					<input
						className='login-input'
						type='password'
						id='login-password'
						placeholder='Enter your password'
						onChange={handleChange}
						name='password'
						value={formData.password}
					/>
				</div>

				{errorMessage && <p className='error-message'>{errorMessage}</p>}

				<button className='login-button'>Log in</button>
			</form>

			<p className='sign-up-option'>
				Don't have an account? <Link to='/signup'>Sign up</Link>
			</p>
		</div>
	);
};

export default Form;
