import React, { Component, Fragment, CSSProperties } from 'react';
import type { ReactNode, ChangeEvent, MouseEvent } from 'react';
import type { Supplier, Consumer } from '../../common/types';

export default class InputFile extends Component<{
	onChange?: Consumer<ChangeEvent<HTMLInputElement>> | undefined;
	value?: string | number | string[] | undefined;
}> {
	hidden: HTMLElement | null = null;

	onClick: Consumer<MouseEvent<HTMLButtonElement>> = e => {
		e.preventDefault();
		if(this.hidden) this.hidden.click();
	};

	hiddenRef: Consumer<HTMLElement | null> = e => {
		this.hidden = e;
	}

	hiddenStyle: CSSProperties = {
		width: '0.1px',
		height: '0.1px',
		opacity: '0',
		overflow: 'hidden',
		position: 'absolute',
		zIndex: -1
	}

	render: Supplier<ReactNode> = () => (
		<Fragment>
			<button onClick={this.onClick}>{this.props.value ? this.props.value : 'Parcourir...'}</button>
			<input
				type="file"
				style={this.hiddenStyle}
				ref={this.hiddenRef}
				onChange={this.props.onChange}
			/>
		</Fragment>
	);
}