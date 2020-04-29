import React, { Component } from 'react';
import FormInput from './common/FormInput';
import type { ReactNode } from 'react';
import type { Consumer, Supplier, Func } from '../common/types';
import type { ChangeEvent } from 'react';

export default class MakePay extends Component {
	state = { clientId: 0, amount: 0 };

	updateState: Func<string, Consumer<ChangeEvent<HTMLInputElement>>> =
		key => (e: ChangeEvent<HTMLInputElement>): void =>
			this.setState({ [key]: e.currentTarget.value });

	render: Supplier<ReactNode> = () => (
		<fieldset>
			<legend>Demande de paiement</legend>
			<form>
				<FormInput
					label="Identifiant client"
					type="number"
					onChange={this.updateState('clientId')}
				/>
				<FormInput
					label="Montant à payer :"
					type="number"
					id="amount"
					onChange={this.updateState('amount')}
				/>
				<div></div>
				<div>
					<button type="submit">Demander</button>
				</div>
			</form>
		</fieldset>
	);
}
