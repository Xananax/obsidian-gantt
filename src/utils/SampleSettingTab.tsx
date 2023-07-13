import {
	App, PluginSettingTab,
	Setting
} from "obsidian";
import type Gantt from "../main";

export interface GanttSettings {
	syntaxHighlight: boolean;
}

export class GanttSettingTab extends PluginSettingTab {
	plugin: Gantt;

	constructor(app: App, plugin: Gantt) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Gantt Chart Options" });

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addToggle((t) => {
				t.setValue(this.plugin.settings.syntaxHighlight);
				t.onChange(async (value) => {
						this.plugin.settings.syntaxHighlight = value;
						if (value) {
								this.plugin.turnOnSyntaxHighlighting();
						} else {
								this.plugin.turnOffSyntaxHighlighting();
						}
						await this.plugin.saveSettings();
				});
		});
	}
}
