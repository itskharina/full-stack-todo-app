import '../../styles/LoginForm.scss';
import React from 'react';
import tokenService from '../../services/token.js';
import { useAppDispatch } from '../../hooks.js';
import { clearTodos } from '../../store/todoSlice.js';

import { useNavigate, Link } from 'react-router-dom';
import loginService from '../../services/login.js';

const Form = () => {
	const [formData, setFormData] = React.useState({ email: '', password: '' });
	const [errorMessage, setError] = React.useState('');
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prevFormData) => {
			return {
				...prevFormData,
				[e.target.name]: e.target.value,
			};
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Form data:', formData);

		// Basic form validation
		if (!formData.email || !formData.password) {
			setError('All fields are required.');
			return;
		}

		try {
			dispatch(clearTodos());

			const response = await loginService.loginUser(formData);

			if (response.token) {
				window.localStorage.setItem('loggedTodoappUser', JSON.stringify(response));
				tokenService.setToken(response.token);
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

// Add link to sign up page
// Add error message if the email and password aren't registered

export default Form;
