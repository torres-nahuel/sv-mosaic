import * as React from 'react';
import { ReactElement, useCallback, useMemo } from 'react';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { Meta } from '@storybook/addon-docs/blocks';

// Components
import FormFieldChipSingleSelect from ".";
import Field, { FieldDefProps } from '@root/components/Field';
import { Sizes } from '@root/theme/sizes';
import Form from '../Form/Form';
import { useForm } from '../Form/formUtils';

export default {
	title: 'Forms|FormFieldChipSingleSelect',
	decorators: [withKnobs],
} as Meta;

export const Default = (): ReactElement => {
	const options = [
		{
			label: 'Option 1',
			value: 'Option_1',
		},
		{
			label: 'Option 2',
			value: 'Option_2',
		},
		{
			label: 'Option 3',
			value: 'Option_3',
		},
	];

	return (
		<Field
			label={text('Label', 'Label')}
			required={boolean('Required', false)}
			disabled={boolean('Disabled', false)}
			helperText={text('Helper text', '')}
			instructionText={text('Instruction text', 'Instruction text')}
			error={text('Error text', '')}
			type={'chip'}
		>
			<FormFieldChipSingleSelect
				label={text('Label', 'Label')}
				disabled={boolean('Disabled', false)}
				inputSettings={{
					options
				}}
				error={text('Error text', '')}
			/>
		</Field>
	);
};

export const FormExample = (): ReactElement => {
	const { state, dispatch, events, registerFields, registerOnSubmit } = useForm();

	const disabled = boolean('Disabled', false);
	const required = boolean('Required', false);

	const options = useMemo(() => [
		{
			label: 'Option 1',
			value: 'Option_1',
		},
		{
			label: 'Option 2',
			value: 'Option_2',
		},
		{
			label: 'Option 3',
			value: 'Option_3',
		},
	], []);

	const fields = useMemo(
		() =>
			[
				{
					name: "chip",
					label: "Regular example",
					type: "chip",
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