import { useEffect, useState } from "react";

export enum States {
	LOADING,
	SUCCESS,
	ERROR,
}

interface UseAwaitResultCommon<Q> {
	status: States;
	setTrigger: (trigger: Q) => void;
}
interface UseAwaitResultLoading<Q> extends UseAwaitResultCommon<Q> {
	status: States.LOADING;
	isLoading: true;
  data: null,
  error: null;
}
interface UseAwaitResultError<Q> extends UseAwaitResultCommon<Q> {
	status: States.ERROR;
	error: Error;
	data: null,
  isLoading: false;
}
interface UseAwaitResultSuccess<T, Q> extends UseAwaitResultCommon<Q> {
	status: States.SUCCESS;
	data: T;
  error: null;
	isLoading: false;
}

type UseAwaitResult<T, Q> = UseAwaitResultLoading<Q> | UseAwaitResultError<Q> | UseAwaitResultSuccess<T, Q>

export const useAwait = <T, Q = string>(
	getQuery: (query: Q, abortSignal: AbortSignal) => Promise<T>,
	initialQuery?: Q
) => {
	const [status, setStatus] = useState<States>(States.LOADING);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [trigger, setTrigger] = useState(initialQuery);

	useEffect(() => {
		if (!trigger) {
			return;
		}
		const abortController = new AbortController();
		getQuery(trigger, abortController.signal)
			.then((obtainedResult) => {
				setData(obtainedResult);
				setStatus(States.SUCCESS);
			})
			.catch((err) => {
				setError(err);
				setStatus(States.ERROR);
			});
		return () => abortController.abort();
	}, [trigger]);

  const isLoading = status === States.LOADING

  //@ts-ignore
  const ret: UseAwaitResult<T, Q> = {
    status, setTrigger, isLoading, error, data
  }

  return ret;
};
