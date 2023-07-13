import * as React from "react";
import { useComponentContext } from "./ComponentContext";
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

let tasks: Task[] = [
    {
      start: new Date(2020, 1, 1),
      end: new Date(2020, 1, 2),
      name: 'Idea',
      id: 'Task 0',
      type:'task',
      progress: 45,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    }
];

const GanttWrapper = () => {
	const { source, type, getAPI } = useComponentContext();

	const field = getAPI()?.page(source);
	console.log("Query results:", { field });
	return (
    <Gantt tasks={tasks} />
	);
};

export default GanttWrapper