import React, { Component } from 'react';
import { callAxios, baseURL } from '../common/utils';
import FormInput from './common/FormInput';
import FormError from './common/FormError';
import type { ReactNode, ChangeEvent, FormEvent } from 'react';
import type { Consumer, Supplier, Trader, Action } from '../common/types';
import { TraderContext } from '../App';
import SubmitButton from './common/SubmitButton';

export default class PickLogo extends Component <{ trader: Trader }>{
	state = {
		previousURI: '',
		previewURL: '',
		errMessage: '',
		handling: false
	};

	traderId = 0;

	checkConnection: Supplier<Promise<boolean>> = async () => false;

	getPreviousURI: Action = () => {
		callAxios<ArrayBuffer>(
			{
				method: 'get',
				url: `/traders/${this.traderId}/logo`,
				responseType: 'arraybuffer'
			},
			[200, 404]
		).then(({ data, status }) => {
			if (status === 200)
				this.setState({
					previousURI:
						'data:image/png;base64,' +
						Buffer.from(data).toString('base64')
				});
		});
	};

	componentDidMount: Action = this.getPreviousURI;

	onChange: Consumer<ChangeEvent<HTMLInputElement>> = async e => {
		this.setState({ handling: true });
		const files = e.target.files;
		try {
			if(! await this.checkConnection())
				throw new Error('');
			if (!files || !files.length)
				throw new Error('');
			const file = files[0];
			if (file.size > 0xfffff)
				throw new Error('Doit faire moins de 4Mo');
			if ('image/png' !== file.type)
				throw new Error('Mauvais type de fichier');
			const formData = new FormData();
			formData.append('FormFile', file);
			const { status } = await callAxios(
				{
					method: 'post',
					url: `/traders/${this.traderId}/logo`,
					data: formData,
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
				[204, 400]
			);
			if (status === 400)
				throw new Error('Choisissez un autre fichier ou réessayez plus tard');
			this.setState({
				errMessage: '',
				previewURL: baseURL + `/traders/${this.traderId}/logo/tmp?foo=${Date.now()}`,
				handling: false
			});
		}
		catch (e) {
			this.setState({
				errMessage: e.message,
				previewURL: '',
				handling: false
			});
		}
	};

	onSubmit: Consumer<FormEvent<HTMLFormElement>> = async e => {
		e.preventDefault();
		this.setState({ handling: true });
		if(await this.checkConnection()) {
			await callAxios(
				{
					method: 'get',
					url: `traders/${this.traderId}/logo?confirm=true`,
				},
				[204]
			);
			this.setState({ previewURL: ''});
			this.getPreviousURI();
		}
		this.setState({ handling: false });
	};

	getPrevious: Supplier<ReactNode> = () => this.state.previousURI
		? (
			<div>
				<div>Votre logo actuel :</div>
				<div><img src={this.state.previousURI} alt="Oups... Il s'est mal chargé." /></div>
			</div>
		)
		: (<div>Vous n&apos;avez pas encore enregistré de logo.</div>);

	getPreview: Supplier<ReactNode> = () => this.state.handling
		? (<div>Nous traitons votre choix...</div>)
		: !this.state.previewURL
			? null
			: (
				<div>
					<img src={this.state.previewURL} alt="Votre nouveau choix a été pris en compte" />
					<SubmitButton handling={this.state.handling} content="Choisir"/>
					<div>
						<button onClick={(): void => this.setState({ previewURL: '' })}>Annuler</button>
					</div>
				</div>
			);

	render: Supplier<ReactNode> = () => (
		<TraderContext.Consumer>{({ trader, checkConnection }: {
			trader: Trader;
			checkConnection: Supplier<Promise<boolean>>;
		}): ReactNode => {
			this.traderId = trader ? trader.id : 0;
			this.checkConnection = checkConnection;
			return (
				<form onSubmit={this.onSubmit}>
					{this.getPrevious()}
					<FormInput
						label={this.state.previousURI ? 'Pour le changer :' : 'Pour remédier à cela :'}
						value="Sélectionner un fichier png"
						type="file"
						accept="image/png"
						onChange={this.onChange}
					/>
					<FormError message={this.state.errMessage} />
					{this.getPreview()}
				</form>
			);
		}}
		</TraderContext.Consumer>
	);
}
