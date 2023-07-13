import {
	App,
	MarkdownPostProcessorContext
} from "obsidian";
import * as React from "react";
import { ReactRenderer } from "./ReactRenderer";
import { getAPI } from "obsidian-dataview";

export const createReactHandler = (app: App, type: string, Component: () => React.JSX.Element) =>
	async (
		source: string,
		container: HTMLElement,
		ctx: MarkdownPostProcessorContext
	): Promise<any> => {
		const view = new ReactRenderer(
			{
				source,
				type,
				container,
				app,
				getAPI: getAPI.bind(app)
			},
			<Component />
		);
		ctx.addChild(view);
	};
