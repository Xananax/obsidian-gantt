import { Plugin } from "obsidian";
import components from "components";
import { createReactHandler } from "utils/createReactHandler";
import { GanttSettingTab, GanttSettings } from "utils/SampleSettingTab";


const DEFAULT_SETTINGS: GanttSettings = {
	syntaxHighlight: false,
};

export default class Gantt extends Plugin {

	settings: GanttSettings;
	private blockMarkerTypes: string[] = [];

	async onload() {
		await this.loadSettings();
		//@ts-ignore
		if(!this.app.plugins.enabledPlugins.has("dataview")){
			throw new Error("DataView is a mandatory plugin")
		}
		if(!components.has("default")!){
			throw new Error("No default component set")
		}
		for(const [type, component] of components){
			this.registerType(type, component);
		}
		this.addSettingTab(new GanttSettingTab(this.app, this));
		//this.app.workspace.onLayoutReady( () => {});
	}

	onunload() {
		this.turnOffSyntaxHighlighting()
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	registerType(type: string = "", Component: () => React.JSX.Element) {
		if (!type) {
			type = "default";
		}
		const blockMarker = type === "default" ? `gantt` : `gantt-${type}`;
		if(this.blockMarkerTypes.indexOf(blockMarker) >= 0){
			return
		}
		this.registerMarkdownCodeBlockProcessor(
			blockMarker,
			createReactHandler(this.app, type, Component)
		);
		this.blockMarkerTypes.push(blockMarker)
	}

	turnOnSyntaxHighlighting() {
		if (!this.settings.syntaxHighlight) {
			return;
		}
		this.blockMarkerTypes.forEach((type) =>
			window.CodeMirror.defineMode(type, (config, options) =>
				window.CodeMirror.getMode({}, "hypermd")
			)
		);

		this.app.workspace.onLayoutReady(() =>
			this.app.workspace.iterateCodeMirrors((cm) =>
				cm.setOption("mode", cm.getOption("mode"))
			)
		);
	}

	turnOffSyntaxHighlighting() {
		this.blockMarkerTypes.forEach((type) => {
			if (window.CodeMirror.modes.hasOwnProperty(type)) {
				delete window.CodeMirror.modes[type];
			}
		});
		this.app.workspace.onLayoutReady(() =>
			this.app.workspace.iterateCodeMirrors((cm) =>
				cm.setOption("mode", cm.getOption("mode"))
			)
		);
	}
}
