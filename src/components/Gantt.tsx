import * as React from "react";
import { useState, useEffect } from "react";
import { useComponentContext } from "./ComponentContext";
import { parseYaml } from "obsidian";
import {
	Gantt as GanttView,
	EventOption,
	StylingOption,
	ViewMode,
	DisplayOption,
	GanttProps,
} from "gantt-task-react";
import ErrorComponent from "./Error";
import "gantt-task-react/dist/index.css";
import { useDataViewQuery } from "src/utils/useDataViewQuery";
import { Grouping, Values } from "obsidian-dataview/lib/data-model/value";
import { STask } from "obsidian-dataview";
import { DateTime, Duration } from "luxon";
import { dataViewTasksToGanttTasks } from "../utils/dataViewTasksToGanttTasks";

export type Task = Omit<STask, "start" | "due"> & {
	id: string;
	project: string;
	progress: number;
	duration: Duration;
	start: DateTime;
	due: DateTime;
	dependencies: string[];
};

const ganttDisplayOptions = {
	viewMode: ViewMode.Day as ViewMode,
	viewDate: new Date(),
	preStepsCount: 5,
};

const gantStylingOptions: StylingOption = {
	listCellWidth: "",
};

export interface Config {
	displayOptions: DisplayOption;
	stylingOptions: StylingOption;
	query: string;
	startDate: DateTime;
}

const GanttViewModeSwitcher = ({
	viewMode,
	onModePress,
}: {
	viewMode: ViewMode;
	onModePress: (newMode: ViewMode) => void;
}) => {
	return (
		<div>
			{Object.values(ViewMode).map((mode) => (
				<button
					key={mode}
					onClick={() => onModePress(mode)}
					className={mode === viewMode ? "mod-cta" : ""}
				>
					{mode}
				</button>
			))}
		</div>
	);
};

const GanttWrapper = () => {
	const { source, type, getAPI, component } = useComponentContext();

	const reposition = () => {
		const factor = 1
		component.containerEl.setAttribute("style", "width:100%; height:100%")
		//@ts-ignore
		const maxWidth = component.containerEl.parentElement?.closest('.view-content')?.offsetWidth || window.innerWidth / 2
		const innerWidth = component.containerEl.parentElement?.parentElement?.offsetWidth || 700
		const width = Math.round((maxWidth * factor))
		const margin = Math.round((width - innerWidth) / -2);
		console.log({maxWidth, innerWidth, width, margin})
		component.containerEl.parentElement?.setAttribute("style", `width: ${width}px; position: relative; left: ${margin}px !important; padding: 2em`)
	}

	useEffect(() => {
    window.addEventListener('resize', reposition);
		reposition()
    return () => {
      window.removeEventListener('resize', reposition);
    };
  }, []);

	const yaml = parseYaml(source);

	const config: Config = {
		query: "",
		startDate: DateTime.now(),
		...(yaml === source ? { query: source } : (yaml as any)),
	};

	config.query = (config.query && config.query.trim()) || "";

	const query = config.query
		? /^(task|table|list)\s/i.test(config.query)
			? config.query
			: `TASK FROM ${config.query}`
		: "";

	const result = useDataViewQuery(getAPI, query);
	const [viewMode, setViewMode] = useState<ViewMode>(
		ganttDisplayOptions.viewMode
	);

	const api = getAPI();
	if (!api) {
		return <ErrorComponent>DataView not found!</ErrorComponent>;
	}
	if (!query) {
		return <ErrorComponent>No query specified</ErrorComponent>;
	} else if (result.isLoading) {
		return <p>... please wait ...</p>;
	} else if (result.error) {
		return (
			<ErrorComponent>Query `{query}` returned no results</ErrorComponent>
		);
	}

	if (result.data.type !== "task") {
		return (
			<ErrorComponent>Query `{query}` returned no tasks</ErrorComponent>
		);
	}

	if (result.data.values[0].rows) {
		return <ErrorComponent>Please do not group tasks</ErrorComponent>;
	}

	const defaultStartDate =
		config.startDate instanceof DateTime
			? config.startDate
			: (api.parse(config.startDate) as DateTime);

	const tasks = dataViewTasksToGanttTasks(
		api,
		result.data.values as STask[],
		defaultStartDate
	);

	const { displayOptions, stylingOptions, ...data } = {
		...config,
		displayOptions: { ...ganttDisplayOptions, ...config.displayOptions },
		stylingOptions: { ...gantStylingOptions, ...config.stylingOptions },
	};

	const ganttProps: GanttProps = {
		...displayOptions,
		...stylingOptions,
		tasks,
	};

	return (
		<section className="blahblah">
			<GanttView {...ganttProps} viewMode={viewMode} />
			<GanttViewModeSwitcher
				viewMode={viewMode}
				onModePress={setViewMode}
			/>
		</section>
	);
};

export default GanttWrapper;
