export type Trader = null | {
	id: number;
	account: { balance: number; gni: string };
	address: string;
	connectionId: string;
	creationTime: string;
	email: string;
	firstName: string;
	label: string;
	password: string;
	phone: string;
	surname: string;
};

export type Client = {
	id: number;
	connectionId: string;
}

export type Purchase = {
	id: number;
	clientId: number;
	payingTime: string | null;
	amount: number;
}

export type Action = () => void;
export type Supplier<T> = () => T;
export type Consumer<T> = (x: T) => void;
export type Func<TIn, TOut> = (x: TIn) => TOut;
