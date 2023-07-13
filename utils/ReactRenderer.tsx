import { App, MarkdownRenderChild } from 'obsidian';
import * as React from 'react';
import { createRoot, Root } from "react-dom/client";
import { ComponentContext, ComponentContextProps } from 'components/ComponentContext';

export type ReactRendererProps = Omit<ComponentContextProps, 'component'> & {
	app: App;
	container: HTMLElement;
};

/**
 * A trivial wrapper which allows a react component to live for the duration of a `MarkdownRenderChild`.
 * Taken wholesale from obsidian, but adapted for react.
 * If Preact is preferrable, copy the snippet from:
 * https://github.com/blacksmithgu/obsidian-dataview/blob/master/src/ui/markdown.tsx#L282
 */
export class ReactRenderer extends MarkdownRenderChild {

	public root: Root

	public constructor(public props: ReactRendererProps, public element: React.JSX.Element) {
		super(props.container);
	}

	public onload(): void {
		const context: ComponentContextProps = Object.assign({}, { component: this }, this.props);
		this.root = createRoot(this.containerEl);
		this.root.render(
			<React.StrictMode>
				<ComponentContext.Provider value={context}>
					{this.element}
				</ComponentContext.Provider>
			</React.StrictMode>
		);
	}

	public onunload(): void {
		this.root && this.root.unmount()
		//unmountComponentAtNode(this.containerEl);
	}
}
