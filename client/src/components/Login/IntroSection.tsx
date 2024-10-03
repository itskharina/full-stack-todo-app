import todoVector from '../../assets/todo-vector.svg';
import '../../styles/IntroSection.scss';

const IntroSection = () => {
	return (
		<>
			<div className='left-side'>
				<img src={todoVector} alt='a running man' />
			</div>
		</>
	);
};

export default IntroSection;
