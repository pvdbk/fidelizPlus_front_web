import React, { Component } from 'react';
import type { ReactNode, DetailedHTMLProps, InputHTMLAttributes } from 'react';
import type { Supplier } from '../../common/types';

export default class FormError extends Component<{
	message: string;
} & DetailedHTMLProps<
	InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>> {
	render: Supplier<ReactNode> = () => {
		const { message, ...divProps } = this.props;
		return (
			<div {...divProps}>
				{!message ? null : <div className="formError">{message}</div>}
			</div>
		);
	};
}
