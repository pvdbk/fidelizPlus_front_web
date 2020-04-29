import React, { Component } from 'react';
import { callAxios } from '../common/utils';
import type { ReactNode } from 'react';
import type { Supplier } from '../common/types';

export default class LogOut extends Component<{ onLogOut: () => void }> {
	render: Supplier<ReactNode> = () => (
		<button
			onClick={(): Promise<void> =>
				callAxios(
					{
						method: 'post',
						url: '/logOut',
					},
					[204, 400]
				).then(this.props.onLogOut)
			}
		>
			Déconnection
		</button>
	);
}
