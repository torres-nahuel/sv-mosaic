import * as React from "react";
import { ReactElement, memo, ChangeEvent } from "react";

// Material UI
import InputAdornment from "@mui/material/InputAdornment";

// Types and styles
import { TextFieldData, TextFieldInputSettings } from "./FormFieldTextTypes";
import { StyledTextField } from "./FormFieldText.styled";
import { MosaicFieldProps } from "@root/components/Field";
import { StyledDisabledText } from "../shared/styledComponents";
import { Sizes } from "@root/theme";

const TextField = (
	props: MosaicFieldProps<"text", TextFieldInputSettings, TextFieldData>
): ReactElement => {
	const {
		fieldDef,
		error,
		onChange,
		onBlur,
		value,
	} = props;

	const leadingElement = fieldDef?.inputSettings?.prefixElement
		? {
			startAdornment: (
				<InputAdornment position='start'>{fieldDef?.inputSettings?.prefixElement}</InputAdornment>
			),
		}
		: null;

	const onFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		onChange && onChange(value === "" ? undefined : value);
	};

	const onFieldBlur = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;

		onBlur && onBlur(value === "" ? undefined : value);
		fieldDef?.onBlurCb && fieldDef?.onBlurCb(value);
	}

	const errorWithMessage = typeof error === "string" ?  error?.trim().length > 0 : false;

	return !fieldDef?.disabled ? (
		<StyledTextField
			id={fieldDef?.name}
			data-testid="form-field-text-test-id"
			value={value ?? ""}
			onChange={onFieldChange}
			onBlur={onFieldBlur}
			variant='outlined'
			error={(errorWithMessage || (errorWithMessage && fieldDef?.required))}
			className={fieldDef?.className}
			placeholder={fieldDef?.inputSettings?.placeholder}
			multiline={fieldDef?.inputSettings?.multiline}
			fieldSize={fieldDef?.size}
			inputProps={{ maxLength: fieldDef?.inputSettings?.maxCharacters > 0 ? fieldDef?.inputSettings?.maxCharacters : null }}
			InputProps={leadingElement}
			required={fieldDef?.required}
			type={fieldDef?.inputSettings?.type === "number" ? "text" : fieldDef?.inputSettings?.type}
			minRows={fieldDef?.inputSettings?.minRows}
			maxRows={fieldDef?.inputSettings?.maxRows}
		/>
	) : (
		<StyledDisabledText width={fieldDef?.size ?? Sizes.sm}>{value ?? fieldDef?.inputSettings?.placeholder ?? "Disabled field"}</StyledDisabledText>
	);
};

export default memo(TextField);
