import * as React from "react";
import { useComponentContext } from "./ComponentContext";

const Greet = () => {
	const { source, type, getAPI } = useComponentContext();

	const field = getAPI()?.page(source);
	console.log("Query results:", { field });
	return (
		<>
			<h1>Greetings!</h1>
			<pre>source:{source}</pre>
			<pre>type:{type}</pre>
		</>
	);
};

export default Greet