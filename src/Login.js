import React, { useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import List from './List';
import {
	Row,
	Col,
	CardBody,
	Card,
	Alert,
	Container,
	Label,
	Input,
} from 'reactstrap';

const Login = (props) => {
	const [username, setusername] = useState('');
	const [password, setPassword] = useState('');
	const [usernameError, setusernameError] = useState('');
	const [passwordError, setPasswordError] = useState('');

	const [islogin, setLogin] = useState(false);

	const onButtonClick = () => {
		setLogin(true);
	};

	return (
		<React.Fragment>
			{!islogin ? (
				<div className={'mainContainer'}>
					<div className={'titleContainer'}>
						<div>Login</div>
					</div>
					<br />
					<div className={'inputContainer'}>
						<input
							value={username}
							placeholder="Enter your username here"
							onChange={(ev) => setusername(ev.target.value)}
							className={'inputBox'}
						/>
						<label className="errorLabel">{usernameError}</label>
					</div>
					<br />
					<div className={'inputContainer'}>
						<input
							value={password}
							placeholder="Enter your password here"
							onChange={(ev) => setPassword(ev.target.value)}
							className={'inputBox'}
						/>
						<label className="errorLabel">{passwordError}</label>
					</div>
					<br />
					<div className={'inputContainer'}>
						<input
							className={'inputButton'}
							type="button"
							onClick={onButtonClick}
							value={'Log in'}
						/>
					</div>
				</div>
			) : (
				<List />
			)}
		</React.Fragment>
	);
};

export default Login;
