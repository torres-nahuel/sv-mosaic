import * as React from "react";
import { useContext } from "react";
import { FormConfig, PageCallbacks } from "./ExampleTypes";
import AppContext from "./AppContext";
import Form, { formActions, useForm } from "@root/components/Form";
import { ButtonProps } from "@root/components/Button";

function FormExample({
	config,
	callbacks,
}: {
config: FormConfig;
callbacks: PageCallbacks;
}) {
	const appContext = useContext(AppContext);
	const { state, dispatch } = useForm();

	const buttons = [
		{
			label: "Cancel",
			onClick: appContext.removeDrawer,
			color: "gray" as ButtonProps['color'],
			variant: "outlined" as ButtonProps['variant'],
		},
		{
			label: "Save",
			onClick: () => callbacks.save(state.data),
			color: "yellow" as ButtonProps['color'],
			variant: "contained" as ButtonProps['variant'],
			show: callbacks.save ? true : false
		},
		{
			label: "Open new form",
			onClick: () =>
				appContext.addDrawer({
					config: {
						type: "form",
						title: "Sub-Form",
						fields: [
							{
								name: "wut",
								label: "Wut",
								type: "text",
							},
							{
								name: "is",
								label: "Is",
								type: "text",
							},
							{
								name: "this",
								label: "This",
								type: "text",
							},
							{
								name: "from_parent",
								label: "From Parent",
								type: "text",
							},
						],
					},
					callbacks: {
						save: (data) => {
							dispatch(
								formActions.setFieldValue({
									name: "from_parent",
									value: JSON.stringify(data)
								})
							);

							appContext.removeDrawer();
						},
					},
				}),
			color: "teal" as ButtonProps['color'],
			variant: "outlined" as ButtonProps['variant'],
		},
	]

	return (
		<div>
			<Form
				title={config.title}
				state={state}
				dispatch={dispatch}
				fields={config.fields}
				buttons={buttons}
				type="drawer"
			/>
			<p>Data: {JSON.stringify(state.data)}</p>
		</div>
	);
}

export default FormExample;
