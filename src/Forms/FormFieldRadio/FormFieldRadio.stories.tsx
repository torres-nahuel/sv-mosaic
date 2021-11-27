import * as React from 'react';
import { useState, ChangeEvent, ReactElement, useMemo, useCallback } from 'react';
import { boolean, withKnobs, text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/addon-docs/blocks';

// Components
import FormFieldRadioButtonGroup from '.';
import Field, { FieldDefProps } from '@root/components/Field';
import Form from '../Form/Form';
import { useForm } from '../Form/formUtils';

export default {
	title: 'Forms|FormFieldRadio',
	decorators: [withKnobs],
} as Meta;

export const Default = (): ReactElement => {
	const [value, setValue] = useState('');

	const handleChange = (value) => {
		setValue(value);
	};

	const options = [
		{
			label: 'Label 1',
			value: 'label_1',
		},
		{
			label: 'Label 2',
			value: 'label_2',
		},
		{
			label: 'Label 3',
			value: 'label_3',
		},
	];

	return (
		<>
			<span>Selected option: {value}</span>
			<Field
				label={text('Label', 'Label')}
				required={boolean('Required', false)}
				disabled={boolean('Disabled', false)}
				helperText={text('Helper text', '')}
				instructionText={text('Instruction text', 'Instruction text')}
				error={text('Error text', '')}
			>
				<FormFieldRadioButtonGroup
					label={text('Label', 'Label')}
					disabled={boolean('Disabled', false)}
					inputSettings={{
						options
					}}
					onChange={handleChange}
					value={value}
				/>
			</Field>
		</>
	);
};

export const FormExample = (): ReactElement => {
	const { state, dispatch, events, registerFields, registerOnSubmit } = useForm();
	
	const disabled = boolean('Disabled', false);
	const required = boolean('Required', false);

	const options = useMemo(() => [
		{
			label: "Label 1",
			value: "label_1"
		},
		{
			label: "Label 2",
			value: "label_2"
		},
		{
			label: "Label 3",
			value: "label_3"
		}
	], []);

	const fields = useMemo(
		() =>
			[
				{
					name: "radio",
					label: "Regular example",
					type: "radio",
					required,
					disabled,
					inputSettings: {
						disabled,
						options,
					},
					helperText: 'Helper text',
					instructionText: 'Instruction text',
				},
			] as unknown as FieldDefProps[],
		[required, disabled]
	);

	useMemo(() => {
		registerFields(fields);
	}, [fields, registerFields]);

	const onSubmit = useCallback((data) => {
		alert('Form submitted with the following data: ' + JSON.stringify(data, null, " "));
	}, [state.validForm]);

	useMemo(() => {
		registerOnSubmit(onSubmit);
	}, [onSubmit, registerOnSubmit]);

	const onCancel = () => {
		alert('Cancelling form, going back to previous site');
	};

	return (
		<>
			<pre>{JSON.stringify(state, null, "  ")}</pre>
			<Form
				title={text('Title', 'Form Title')}
				description={text('Description', 'This is a description example')}
				state={state}
				fields={fields}
				dispatch={dispatch}
				events={events}
				onCancel={onCancel}
				onSubmit={onSubmit}
			/>
		</>
	);
};
