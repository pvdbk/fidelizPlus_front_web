import React, { Component, ChangeEvent, FocusEvent, ReactNode } from 'react';
import FormInput from '../common/FormInput';
import FormError from '../common/FormError';
import { callAxios } from '../../common/utils';
import type { Consumer, Supplier } from '../../common/types';

export default class ConnectionId extends Component<{
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> {
	state = { errMessage: '' };
	onBlur: Consumer<FocusEvent<HTMLInputElement>> = e => {
		if (e.target.value)
			callAxios(
				{
					method: 'get',
					url: '/traders/connectionId/' + e.target.value,
				},
				[200, 404]
			).then(({ status }) =>
				this.setState({
					errMessage: status === 200 ? 'Déjà utilisé' : '',
				})
			);
	};
	render: Supplier<ReactNode> = () => (
		<div>
			<FormInput
				label="Identifiant de connexion :"
				onChange={this.props.onChange}
				onBlur={this.onBlur}
			/>
			<FormError message={this.state.errMessage} />
		</div>
	);
}
