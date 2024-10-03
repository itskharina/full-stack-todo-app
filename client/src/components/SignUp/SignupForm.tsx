import React from 'react';
import '../../styles/SignupForm.scss';

const SignupForm = () => {
	const [formData, setFormData] = React.useState({
		firstName: '',
		lastName: '',
		username: '',
		password: '',
		confirmPassword: '',
	});

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
					<label htmlFor='signup-username'>Username</label>
					<input
						className='signup-input'
						type='text'
						id='signup-username'
						placeholder='Enter a username'
						onChange={handleChange}
						name='username'
						value={formData.username}
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

				<button className='signup-button'>Sign up</button>
			</form>
		</div>
	);
};

export default SignupForm;
