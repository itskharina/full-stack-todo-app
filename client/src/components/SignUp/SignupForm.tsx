import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/SignupForm.scss';
import userService from '../../services/user.js';
import loginService from '../../services/login.js';

const SignupForm = () => {
	const [formData, setFormData] = React.useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [errorMessage, setError] = React.useState('');
	const navigate = useNavigate();

	const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	const isPasswordStrong = (password: string) =>
		password.length >= 5 && /\d/.test(password) && /[A-Z]/.test(password);

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
		if (
			!formData.firstName ||
			!formData.lastName ||
			!formData.email ||
			!formData.password
		) {
			setError('All fields are required.');
			return;
		}

		if (!isValidEmail(formData.email)) {
			setError('Please enter a valid email address.');
			return;
		}

		if (!isPasswordStrong(formData.password)) {
			setError(
				'Password must be at least 5 characters long, contain a number, and an uppercase letter.'
			);
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		// Map formData to match INewUser interface
		const userPayload = {
			first_name: formData.firstName,
			last_name: formData.lastName,
			email: formData.email,
			password: formData.password,
		};

		try {
			await userService.createUser(userPayload);

			const loginPayload = {
				email: userPayload.email,
				password: userPayload.password,
			};

			const response = await loginService.loginUser(loginPayload);
			if (response.token) {
				localStorage.setItem('token', response.token);
				navigate('/upcoming');
			} else {
				setError('Redirection failed, please try again.');
			}
		} catch (error) {
			console.error('Error in handleSubmit:', error);
			setError('Creation failed. Please try again.');
		}
	};

	return (
		<div className='signup-container'>
			<form className='signup-form' onSubmit={handleSubmit}>
				<div className='signup-text'>
					<h2 className='signup-title'>Sign up</h2>
					<p className='enter-details'>Please enter your details</p>
				</div>

				<div className='signup-form-item'>
					<label htmlFor='signup-first-name'>First Name</label>
					<input
						className='signup-input'
						type='text'
						id='signup-first-name'
						placeholder='John'
						onChange={handleChange}
						name='firstName'
						value={formData.firstName}
					/>
				</div>

				<div className='signup-form-item'>
					<label htmlFor='signup-last-name'>Last Name</label>
					<input
						className='signup-input'
						type='text'
						id='signup-last-name'
						placeholder='Doe'
						onChange={handleChange}
						name='lastName'
						value={formData.lastName}
					/>
				</div>

				<div className='signup-form-item'>
					<label htmlFor='signup-email'>Email</label>
					<input
						className='signup-input'
						type='text'
						id='signup-email'
						placeholder='Enter your email'
						onChange={handleChange}
						name='email'
						value={formData.email}
					/>
				</div>

				<div className='signup-form-item'>
					<label htmlFor='signup-password'>Password</label>
					<input
						className='signup-input'
						type='text'
						id='signup-password'
						placeholder='Password'
						onChange={handleChange}
						name='password'
						value={formData.password}
					/>
				</div>

				<div className='signup-form-item'>
					<label htmlFor='signup-confirm-password'>Confirm Password</label>
					<input
						className='signup-input'
						type='text'
						id='signup-confirm-password'
						placeholder='Re-enter your password'
						onChange={handleChange}
						name='confirmPassword'
						value={formData.confirmPassword}
					/>
				</div>
				{errorMessage && <p className='error-message'>{errorMessage}</p>}
				<button className='signup-button'>Sign up</button>
			</form>
		</div>
	);
};

export default SignupForm;
