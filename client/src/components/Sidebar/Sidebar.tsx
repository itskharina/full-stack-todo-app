import { FaBars } from 'react-icons/fa6';
import { CgClose } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData.js';
import '../../styles/Sidebar.scss';
import { IconContext } from 'react-icons';
import { useSidebar } from './SidebarContext.js';

function Sidebar() {
	const { sidebar, toggleSidebar } = useSidebar();

	return (
		<>
			<IconContext.Provider value={{ color: 'undefined' }}>
				<div className='navbar'>
					<button
						className='menu-bars'
						onClick={toggleSidebar}
						aria-label='Toggle sidebar'
					>
						<FaBars color='white' />
					</button>
				</div>

				<nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
					<ul className='nav-menu-items' onClick={toggleSidebar}>
						<li className='navbar-toggle'>
							<Link to='#' className='menu-bars'>
								<CgClose color='#524f5f' />
							</Link>
						</li>
						{SidebarData.map((category) => {
							return (
								<>
									<h3 className={category.cName}>{category.title}</h3>
									<ul className='categories'>
										{category.items.map((item, index) => {
											return (
												<li key={index} className={item.cName}>
													<Link to={item.path}>
														{item.icon}
														<span>{item.title}</span>
													</Link>
												</li>
											);
										})}
									</ul>
								</>
							);
						})}
					</ul>
				</nav>
			</IconContext.Provider>
		</>
	);
}

export default Sidebar;
