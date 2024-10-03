import '../../styles/LoginForm.scss';
import React from 'react';

const Form = () => {
	const [formData, setFormData] = React.useState({ username: '', password: '' });

	// console.log(formData)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prevFormData) => {
			return {
				...prevFormData,
				[e.target.name]: e.target.value,
			};
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// submitToApi(formData)
		console.log(formData);
	};

	return (
		<div className='right-side'>
			<form className='login-form' onSubmit={handleSubmit}>
				<div className='login-form-top-text'>
					<h2 className='login-form-title'>Login</h2>
					<p className='welcome-back'>Nice to see you!</p>
				</div>

				<div className='login-form-item'>
					<label htmlFor='login-username'>Username</label>
					<input
						className='login-input'
						type='text'
						id='login-username'
						placeholder='Enter your username'
						onChange={handleChange}
						name='username'
						value={formData.username}
					/>
				</div>

				<div className='login-form-item'>
					<label htmlFor='login-password'>Password</label>
					<input
						className='login-input'
						type='text'
						id='login-password'
						placeholder='Enter your password'
						onChange={handleChange}
						name='password'
						value={formData.password}
					/>
				</div>
				<button className='login-button'>Log in</button>
			</form>
			<p className='sign-up-option'>
				Don't have an account? <a href='#'>Sign up</a>
			</p>
		</div>
	);
};

// Add link to sign up page
// Add error message if the username and password aren't registered

export default Form;
