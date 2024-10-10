import todoVector from '../../assets/todo-vector.svg';
import '../../styles/IntroSection.scss';

const IntroSection = () => {
	return (
		<>
			<div className='left-side'>
				<img src={todoVector} className='todo-vector' alt='todo' />
			</div>
		</>
	);
};

export default IntroSection;
