import * as React from "react";
import { ButtonProps } from "@root/components/Button";
import { FieldDef } from "@root/components/Field";
import {
	ChangeEvent,
	memo,
	ReactElement,
	useCallback,
	useEffect,
	useMemo,
	useState
} from "react";
import Button from "../../components/Button";
import Form, { formActions, useForm } from "@root/components/Form";
import {
	InputWrapper,
	StyledInput
} from "./AdvancedSelection.styled";
import AddIcon from "@mui/icons-material/Add";
import ChipList from "./ChipList";
import { optionsWithCategory } from "./AdvancedSelectionTypes";
import { FormFieldCheckboxDef } from "../FormFieldCheckbox";
import LoadMoreButton from "./LoadMoreButton";
import { AdvanceSelectionDrawerPropTypes } from ".";
import _ from "lodash";

const AdvancedSelectionDrawer = (props: AdvanceSelectionDrawerPropTypes): ReactElement => {
	const {
		value,
		fieldDef,
		onChange,
		isModalOpen,
		isMobileView,
		handleClose,
		handleUnsavedChanges,
		dialogOpen,
		handleDialogClose,
	} = props;

	const [options, setOptions] = useState<optionsWithCategory[]>([]);
	const [filteredOptions, setFilteredOptions] = useState<optionsWithCategory[]>([]);
	const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
	const [filter, setFilter] = useState({ prev: "options", new: "options" });

	const { state, dispatch } = useForm();

	useEffect(() => {
		if (state.data.checkboxList !== undefined) {
			handleUnsavedChanges(!_.isEqual([...value], state?.data?.checkboxList));
		}
	}, [state.data.checkboxList, value]);

	useEffect(() => {
		let isMounted = true;
		if (value.length > 0 && isModalOpen) {
			isMounted && dispatch(
				formActions.setFieldValue({
					name: "checkboxList",
					value: value,
				})
			);
		}

		return () => {
			isMounted = false;
		}
	}, [value, isModalOpen]);

	useEffect(() => {
		let isMounted = true;
		const setInternalOptions = async () => {
			if (fieldDef?.inputSettings?.getOptions) {
				await getMoreOptions();
			} else if (fieldDef?.inputSettings?.checkboxOptions) {
				setOptions(options.concat(fieldDef?.inputSettings?.checkboxOptions));
			}
		}

		if (isMounted) {
			setInternalOptions();
		}

		return () => {
			isMounted = false;
		}
	}, [
		fieldDef?.inputSettings?.checkboxOptions,
		fieldDef?.inputSettings?.getOptions,
		fieldDef?.inputSettings?.getOptionsLimit
	]);

	const getMoreOptions = async () => {
		if (fieldDef?.inputSettings?.getOptions) {
			const searchInput = state?.data?.searchInput;

			let newOptions = [];
			if (filter.prev === filter.new) {
				newOptions = await fieldDef?.inputSettings?.getOptions({
					offset: filteredList ? filteredList.length : 0,
					limit: fieldDef?.inputSettings?.getOptionsLimit ? +fieldDef?.inputSettings?.getOptionsLimit + 1 : null,
					filter: searchInput?.length > 0 ? searchInput : undefined,
				});
			} else {
				newOptions = await fieldDef?.inputSettings?.getOptions({
					offset: 0,
					limit: fieldDef?.inputSettings?.getOptionsLimit ? +fieldDef?.inputSettings?.getOptionsLimit + 1 : null,
					filter: searchInput?.length > 0 ? searchInput : undefined,
				});
			}

			if (newOptions.length > +fieldDef?.inputSettings?.getOptionsLimit) {
				newOptions.pop();
				setCanLoadMore(true);
			} else {
				setCanLoadMore(false);
			}

			if (filter.prev === "filter" && filter.new === "options") {
				setOptions(newOptions);
			}

			if (filter.prev === "options" && filter.new === "options") {
				setOptions(options.concat(newOptions));
			}

			if (filter.prev === "options" && filter.new === "filter") {
				setFilteredOptions(newOptions);
			}

			if (filter.prev === "filter" && filter.new === "filter") {
				setFilteredOptions(filteredOptions.concat(newOptions));
			}
		}
	};

	const getMoreOptionsDebounced = _.debounce(getMoreOptions, 300);

	useEffect(() => {
		let isMounted = true;
		isMounted && getMoreOptionsDebounced();
		return () => {
			isMounted = false;
			getMoreOptionsDebounced.cancel();
		}
	}, [filter]);

	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			const searchInput = state?.data?.searchInput;

			if (searchInput && searchInput?.length > 0) {
				setFilter({ prev: filter.new, new: "filter" });
			} else {
				setFilter({ prev: filter.new, new: "options" });
			}
		}

		return () => {
			isMounted = false;
		}
	}, [state?.data?.searchInput]);

	const loadMoreOptions = () => {
		setFilter({ prev: filter.new, new: filter.new });
	}

	const filteredList = useMemo(() => {
		const searchInput = state?.data?.searchInput;

		if (searchInput) {
			const trimmedFilter = searchInput?.trim().toLowerCase();
			return filteredOptions.filter(
				(option) => searchInput === "" || option.label.toLowerCase().includes(trimmedFilter)
			);
		}

		return options;
	}, [
		options,
		filteredOptions,
		state?.data?.searchInput,
	]);

	const searchInput = useCallback((props): ReactElement => {
		const searchKeyword = props.value.trim();

		/**
		 * Handler for the input element
		 * @param e input change event
		 */
		const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
			dispatch(
				formActions.setFieldValue({
					name: "searchInput",
					value: e.target.value
				})
			);
		};

		/**
		 * Adds an options to the list.
		 */
		const createOption = async () => {
			const canBeCreated = searchKeyword.length > 0;
			if (canBeCreated) {
				const newOptionValue = await fieldDef?.inputSettings?.createNewOption(searchKeyword);
				const newOption = {
					label: searchKeyword,
					value: newOptionValue,
				}

				setFilteredOptions([...filteredOptions, newOption]);
			}
		};

		return (
			<InputWrapper isMobileView={isMobileView}>
				<StyledInput
					type='text'
					placeholder='Search...'
					onChange={onInputChange}
					value={props.value ? props.value : ""}
					disabled={fieldDef?.disabled}
				/>
				{props.value && fieldDef?.inputSettings?.createNewOption && (
					<Button
						label='Create'
						variant='text'
						color='teal'
						disabled={fieldDef?.disabled}
						mIcon={AddIcon}
						onClick={createOption}
					/>
				)}
			</InputWrapper>
		)
	}, [fieldDef?.disabled, options]);

	const deleteSelectedOption = (newOptions) => {
		dispatch(
			formActions.setFieldValue({
				name: "checkboxList",
				value: newOptions,
			})
		);
	}

	const fields = useMemo(
		() => ([
			{
				name: "listOfChips",
				type: ChipList,
				disabled: fieldDef?.disabled,
				inputSettings: {
					getSelected: fieldDef?.inputSettings?.getSelected,
					isModalOpen,
					isMobileView,
					selectedOptions: state?.data?.checkboxList,
					deleteSelectedOption,
				}
			},
			{
				name: "searchInput",
				type: searchInput,
			},
			{
				name: "checkboxList",
				type: "checkbox",
				disabled: fieldDef?.disabled,
				style: {
					height: "353px",
					overflowY: "auto",
					flexWrap: "nowrap",
					width: "100%",
				},
				size: "100%",
				inputSettings: {
					options: filteredList,
				}
			} as FieldDef<FormFieldCheckboxDef>,
			{
				name: "loadMoreButton",
				type: LoadMoreButton,
				disabled: fieldDef?.disabled,
				inputSettings: {
					canLoadMore,
					getMoreOptions: loadMoreOptions,
					parentInputSettings: fieldDef?.inputSettings,
				}
			},
		] as FieldDef[] ), [
			filteredList,
			searchInput,
			fieldDef,
			canLoadMore,
			getMoreOptions,
			isModalOpen,
			isMobileView,
		]
	);

	/**
	 * Modal is closed when the Save button is clicked.
	 */
	const onSubmit = async () => {
		const { valid } = await dispatch(formActions.submitForm());
		if (!valid) return;

		await onChange(state.data.checkboxList);

		handleClose(true);
	};

	const buttons: ButtonProps[] = [
		{
			label: "Cancel",
			onClick: () => handleClose(),
			color: "gray",
			variant: "outlined"
		},
		{
			label: "Save",
			onClick: onSubmit,
			color: "yellow",
			variant: "contained"
		}
	];

	return (
		<Form
			title={fieldDef?.label}
			buttons={buttons}
			type='drawer'
			state={state}
			dispatch={dispatch}
			fields={fields}
			dialogOpen={dialogOpen}
			handleDialogClose={handleDialogClose}
		/>
	);
};

export default memo(AdvancedSelectionDrawer);
