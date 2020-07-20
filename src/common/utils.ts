import axios from 'axios';
// import { SHA256 } from 'crypto-js';
import type { AxiosRequestConfig, AxiosPromise } from 'axios';

export const domain = 'localhost:5000';
export const baseURL = `http://${domain}`;

const axiosInstance = axios.create({
	baseURL,
	validateStatus: (status) => status >= 200 && status < 500,
	withCredentials: true,
});

export const callAxios = <T>(
	options: AxiosRequestConfig,
	valideStatus: number[] | null = null
): AxiosPromise<T> =>
		axiosInstance({
			...(valideStatus
				? { validateStatus: (status: number): boolean => valideStatus.includes(status) }
				: {}),
			...options,
		});

export const hash = (s: string): string => s;
// export const hash = (s: string): string => SHA256(s).toString();

export const xor = (x: boolean, y: boolean): boolean => (x && !y) || (y && !x);

export const nop = (): void => { /* nop */ };
