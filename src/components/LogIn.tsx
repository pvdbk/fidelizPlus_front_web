import React, { Component } from 'react';
import SubmitButton from './common/SubmitButton';
import FormError from './common/FormError';
import FormInput from './common/FormInput';
import { callAxios, hash } from '../common/utils';
import type { ReactNode, FormEvent, ChangeEvent } from 'react';
import type { Trader, Consumer, Supplier, Func } from '../common/types';

export default class LogIn extends Component<{ onLogIn: Consumer<Trader> }> {
	state = {
		connectionId: '',
		password: '',
		handling: false,
		errMessage: '',
	};

	updateState: Func<string, Consumer<ChangeEvent<HTMLInputElement>>> =
		key => (e: ChangeEvent<HTMLInputElement>): void =>
			this.setState({ [key]: e.currentTarget.value });

	connection: Consumer<FormEvent<HTMLFormElement>> = e => {
		e.preventDefault();
		this.setState({ handling: true });
		callAxios<Trader>(
			{
				method: 'post',
				url: '/logIn',
				data: {
					userType: 'trader',
					connectionId: this.state.connectionId,
					password: hash(this.state.password),
				},
			},
			[200, 400, 404]
		).then(({ status, data }) => {
			if (status !== 200)
				this.setState({
					handling: false,
					errMessage:
						status === 404
							? 'Identifiant inconnu'
							: 'Mauvais mot de passe',
				});
			else this.props.onLogIn(data);
		});
	};

	render: Supplier<ReactNode> = () => (
		<div className="centralDiv">
			<fieldset>
				<legend>Connexion</legend>
				<form onSubmit={this.connection}>
					<FormInput
						label="Identifiant de connexion :"
						onChange={this.updateState('connectionId')}
						required={true}
					/>
					<FormInput
						label="Mot de passe :"
						type="password"
						onChange={this.updateState('password')}
						required={true}
					/>
					<FormError message={this.state.errMessage} />
					<SubmitButton handling={this.state.handling} content="Se connecter" />
				</form>
			</fieldset>
		</div>
	);
}
