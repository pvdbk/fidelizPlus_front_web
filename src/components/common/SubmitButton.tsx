import React, { Component } from 'react';
import type { Supplier } from '../../common/types';
import type { ReactNode } from 'react';

export default class SubmitButton extends Component<{
	handling: boolean;
	content: string;
}> {
	render: Supplier<ReactNode> = () => (
		<div>{this.props.handling
			? (<button disabled>En traitement...</button>)
			: (<button type="submit">{this.props.content}</button>)
		}</div>
	);
}
