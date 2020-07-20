import React, { Component } from 'react';
import FormInput from './common/FormInput';
import FormError from './common/FormError';
import SubmitButton from './common/SubmitButton';
import { callAxios, domain } from '../common/utils';
import { TraderContext } from '../App';
import type { Consumer, Supplier, Func, Action, Trader, Client, Purchase } from '../common/types';
import type { ReactNode, ChangeEvent, FormEvent } from 'react';

export default class MakePay extends Component {
	state: {
		clientId: string;
		amount: string;
		connectionId: string;
		purchaseId: number;
		notFound: boolean;
		socket: WebSocket | null;
		closeEvent: CloseEvent | null;
		handling: boolean;
	} = {
		clientId: '',
		amount: '',
		connectionId: '',
		purchaseId: 0,
		notFound: false,
		socket: null,
		closeEvent: null,
		handling: false
	};

	traderId = 0;

	checkConnection: Supplier<Promise<boolean>> = async () => false;

	updateState: Func<string, Consumer<ChangeEvent<HTMLInputElement>>> =
		key => (e: ChangeEvent<HTMLInputElement>): void =>
			this.setState({ [key]: e.currentTarget.value });

	findClient: Action = async () => {
		this.setState({ notFound: false });
		if(this.state.clientId !== '')
		{
			const clientId = Number.parseInt(this.state.clientId);
			const { status, data } = await callAxios<Client>(
				{
					method: 'get',
					url: `clients/${clientId}`
				},
				[200, 404]
			);
			this.setState(status === 200
				? { connectionId: data.connectionId, notFound: false }
				: { connectionId: '', notFound: true }
			);
		}
		else this.setState({ connectionId: '' });
	}

	onSubmit: Consumer<FormEvent<HTMLFormElement>> = async e => {
		e.preventDefault();
		this.setState({ handling: true });
		if (this.state.socket !== null)
		{
			this.state.socket.send('cancel');
			await callAxios({
				method: 'delete',
				url: `/traders/${this.traderId}/purchases/${this.state.purchaseId}`
			});
			this.setState({ handling: false });
		}
		else if(await this.checkConnection())
		{
			const clientId = Number.parseInt(this.state.clientId);
			const amount = Number.parseFloat(this.state.amount);
			const { data: { id: purchaseId } } = await callAxios<Purchase>(
				{
					method: 'post',
					url: `traders/${this.traderId}/purchases/clients/${clientId}?amount=${amount}`
				},
				[201]
			);
			const socket: WebSocket = new WebSocket(`ws://${domain}/ws`);
			socket.onopen = (): void => {
				socket.send(`${purchaseId}`);
				this.setState({
					socket,
					purchaseId,
					handling: false
				});
			};
			socket.onclose = (e: CloseEvent): void => this.setState({
				closeEvent: { code: e.code, reason: e.reason },
				socket: null
			});
		}
	}

	infoClient: Supplier<ReactNode> = () =>
		this.state.connectionId
			? (<div>S&apos;agit-il bien de {this.state.connectionId} ?</div>)
			: null;

	render: Supplier<ReactNode> = () => (
		<TraderContext.Consumer>{({ trader, checkConnection }: {
			trader: Trader;
			checkConnection: Supplier<Promise<boolean>>;
		}): ReactNode => {
			this.traderId = trader ? trader.id : 0;
			this.checkConnection = checkConnection;
			return (
				<fieldset>
					<legend>Demande de paiement</legend>
					<form onSubmit={this.onSubmit}>
						<FormInput
							label="Identifiant client"
							type="number"
							step="1"
							onChange={this.updateState('clientId')}
							onBlur={this.findClient}
							required={true}
						/>
						<FormInput
							label="Montant à payer :"
							type="number"
							step="0.01"
							onChange={this.updateState('amount')}
							required={true}
						/>
						<FormError message={this.state.notFound ? 'Client non trouvé' : ''} />
						<SubmitButton
							content={this.state.socket ? 'Annuler' : 'Demander'}
							handling={this.state.handling}
						/>
						{this.infoClient()}
					</form>
				</fieldset>
			);
		}}</TraderContext.Consumer>
	);
}
