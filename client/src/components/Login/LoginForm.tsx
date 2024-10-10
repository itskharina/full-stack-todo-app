import '../../styles/LoginForm.scss';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/user.js';

const Form = () => {
	const [formData, setFormData] = React.useState({ email: '', password: '' });
	const [errorMessage, setError] = React.useState('');
	const navigate = useNavigate();

	useEffect(() => {
		// Remove any existing tokens
		localStorage.removeItem('token');
	}, []);

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
		console.log('Form data:', formData); // Add this line

		try {
			const response = await userService.loginUser(formData);
			console.log('Response from backend:', response); // Add this line

			if (response.token) {
				localStorage.setItem('token', response.token);
				navigate('/upcoming');
			} else {
				setError('Invalid credentials');
			}
		} catch (error) {
			console.error('Error in handleSubmit:', error); // Add this line
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
				Don't have an account? <a href='#'>Sign up</a>
			</p>
		</div>
	);
};

// Add link to sign up page
// Add error message if the email and password aren't registered

export default Form;
