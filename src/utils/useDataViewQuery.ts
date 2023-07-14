import { useAwait } from "./useAwait";
import type { DataviewApi } from "obsidian-dataview";
import type { App } from "obsidian";

type GetAPI = (app?: App) => DataviewApi | undefined;

export const useDataViewQuery = (getAPI: GetAPI, initialQuery = "") =>
	useAwait((query) => {
		const api = getAPI();
		if (!api) {
			throw new Error("DataView API not found");
		}
		return api.query(query).then(result=>{
			if(result.successful){
				return result.value
			}
			throw new Error(result.error)
		})
	}, initialQuery);
