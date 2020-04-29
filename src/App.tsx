import './App.css';
import React, { Component, createContext } from 'react';
import LogIn from './components/LogIn';
import LogOut from './components/Logout';
import PickLogo from './components/PickLogo';
import { callAxios, xor } from './common/utils';
import type { ReactNode } from 'react';
import type { Action, Supplier, Func, Trader } from './common/types';

export const TraderContext = createContext<{
	trader: Trader;
	checkConnection: Supplier<Promise<boolean>>;
}>({
	trader: null,
	checkConnection: async () => false
});

export default class App extends Component {
	state: {
		trader: Trader;
		loading: boolean;
	} = {
		trader: null,
		loading: true
	};


	checkConnection: Supplier<Promise<boolean>> = async () => {
		const { data, status } = await callAxios(
			{
				method: 'get',
				url: '/credentials',
			},
			[200, 204]
		);
		if(this.state.loading || xor(status !== 200, !this.state.trader))
			this.setState({
				loading: false,
				trader: status === 200 ? data : null
			});
		return status === 200;
	};

	componentDidMount: Action = this.checkConnection;

	setTrader: Func<Trader, void> = trader =>
		this.setState({ trader });

	nullifyTrader: Action = () =>
		this.setState({ trader: null });

	getContent: Supplier<ReactNode> = () =>
		this.state.trader ? (
			<div>
				<PickLogo trader={this.state.trader} />
				<LogOut onLogOut={this.nullifyTrader} />
			</div>
		) : this.state.loading ? (
			<div>En attente...</div>
		) : (
			<LogIn onLogIn={this.setTrader} />
		);

	render: Supplier<ReactNode> = () => (
		<TraderContext.Provider value={{
			trader: this.state.trader,
			checkConnection: this.checkConnection
		}}>
			{this.getContent()}
		</TraderContext.Provider>
	);
}
