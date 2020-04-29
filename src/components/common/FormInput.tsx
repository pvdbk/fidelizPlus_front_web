import React, { Component } from 'react';
import type { ReactNode, DetailedHTMLProps, InputHTMLAttributes } from 'react';
import type { Supplier } from '../../common/types';
import InputFile from './InputFile';


export default class FormInput extends Component<
	DetailedHTMLProps<
		InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> & {
		label?: string;
}> {
	render: Supplier<ReactNode> = () => {
		const {label, ...inputProps} = this.props;
		const { onChange, value } = inputProps;
		const input = inputProps.type === 'file'
			? <InputFile {...{ onChange, value }} />
			: <input {...inputProps} {...(inputProps.type ? {} : { type: 'text' })} />;
		return label
			? (
				<div>
					<label>
						{label}
						<br />
						{input}
					</label>
				</div>
			)
			: (
				<div>
					{input}
				</div>
			);
	}
}
