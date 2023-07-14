import { Task as GanttTask } from "gantt-task-react";
import { DataviewApi, STask } from "obsidian-dataview";
import { DateTime, Duration } from "luxon";
import { Task } from "../components/Gantt";

export const dataViewTasksToGanttTasks = (
	api: DataviewApi,
	values: STask[],
	defaultStartDate: DateTime
) => {
	const defaultDuration = api.parse("1 day") as Duration;

	const getDuration = (value: any) => {
		if (Array.isArray(value)) {
			value = value[0];
		}
		if (value instanceof Duration) {
			return value;
		}
		return null;
	};

	const tasksFirstPass = values.reduce((m, task) => {
		task.duration = getDuration(task.duration) || defaultDuration;
		task.start = (task.start as DateTime) || defaultStartDate;

		task.due = task.start.plus(task.duration);
		task.dependencies = task.children.reduce((acc: string[], childTask) => {
			if (!childTask.task) {
				return acc;
			}
			childTask.id = childTask.line + "";
			acc.push(childTask.id);
			return acc;
		}, [] as string[]);
		task.id = task.id || task.line + "";
		task.progress = parseFloat(task.progress) || 0;

		task.project =
			task.section?.subpath?.replace(/.*project\s(.*?)(?:\s|$)/, "$1") ||
			(api.page(task.path)?.project as String)?.toLowerCase() ||
			task.tags
				.find((t) => t.startsWith("#project/"))
				?.replace("#project/", "") ||
			"UNSORTED";
		m.set(task.id, task as unknown as Task);
		return m;
	}, new Map<string, Task>());

	const findLatestChildDate = (task: Task) => {
		let start = task.start;
		task.dependencies.length &&
			task.dependencies.forEach((subTaskId) => {
				const subTask = tasksFirstPass.get(subTaskId)!;
				start = DateTime.max(start, findLatestChildDate(subTask));
			});
		if (!start.equals(task.start)) {
			task.start = start.plus(defaultDuration).plus(defaultDuration);
			task.due = task.start.plus(task.duration);
		}
		return task.due;
	};

	const tasks: GanttTask[] = [];

	for (const [id, task] of tasksFirstPass) {
		findLatestChildDate(task);

		const ganttTask: GanttTask = {
			start: task.start.toJSDate(),
			end: task.due.toJSDate(),
			name: task.text,
			id: task.id,
			type: task.parent === null ? "milestone" : "task",
			progress: task.progress,
			project: task.project,
			dependencies: task.dependencies,
			//isDisabled: true,
			//styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
		};
		tasks.push(ganttTask);
	}

	tasks.reverse();

	return tasks;
};
