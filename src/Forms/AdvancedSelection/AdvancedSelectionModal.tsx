import { FieldDef } from '@root/components/Field';
import Modal from '@root/components/Modal';
import * as React from 'react';
import {
	ChangeEvent,
	memo,
	ReactElement,
	useCallback,
	useEffect,
	useMemo,
	useState
} from 'react';
import Button from '../Button';
import { actions, useForm } from '../Form/formUtils';
import {
	InputWrapper,
	StyledInput
} from './AdvancedSelection.styled';
import AddIcon from '@material-ui/icons/Add';
import ChipList from './ChipList';
import { optionsWithCategory } from './AdvancedSelectionTypes';
import { FormFieldCheckboxDef } from '../FormFieldCheckbox';
import LoadMoreButton from './LoadMoreButton';
import DrawerContent from '../../components/DrawerContent.jsx';
import FormLayout from '../Form/FormLayout';

const AdvancedSelectionModal = (props): ReactElement => {
	const {
		value,
		fieldDef,
		onChange,
		isModalOpen,
		isMobileView,
		handleCloseModal,
	} = props;

	const [options, setOptions] = useState<optionsWithCategory[]>([]);
	const [filteredOptions, setFilteredOptions] = useState<optionsWithCategory[]>([]);
	const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
	const [filter, setFilter] = useState({ prev: 'options', new: 'options' });

	const { state, dispatch, registerFields, registerOnSubmit } = useForm();

	useEffect(() => {
		if (value.length > 0 && isModalOpen)
			dispatch(
				actions.setFieldValue({
					name: 'checkboxList',
					value: value,
				})
			);
	}, [value, isModalOpen]);

	useEffect(() => {
		const setInternalOptions = async () => {
			if (fieldDef?.inputSettings?.getOptions) {
				await getMoreOptions();
			} else if (fieldDef?.inputSettings?.checkboxOptions) {
				setOptions(options.concat(fieldDef?.inputSettings?.checkboxOptions));
			}
		}

		setInternalOptions();
	}, [
		// isModalOpen,
		fieldDef?.inputSettings?.checkboxOptions,
		fieldDef?.inputSettings?.getOptions,
		fieldDef?.inputSettings?.getOptionsLimit
	]);

	const debounce = (func, timeout = 300) => {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => { func.apply(this, args); }, timeout);
		};
	}

	const a = debounce(async () => await getMoreOptions());

	useEffect(() => {
		a();
	}, [filter]);

	useEffect(() => {
		const searchInput = state?.data?.searchInput;

		if (searchInput?.length > 0) {
			setFilter({ prev: filter.new, new: 'filter' });
		} else {
			setFilter({ prev: filter.new, new: 'options' });
		}

		// if (searchInput !== undefined) {
		// 	a();
		// }

		//
		// if (searchInput?.length === 0 && fieldDef?.inputSettings?.getMoreOptions)
		// 	setCanLoadMore(true);
		//
	}, [state?.data?.searchInput]);

	const loadMoreOptions = () => {
		setFilter({ prev: filter.new, new: filter.new });
	}

	const filteredList = useMemo(() => {
		const searchInput = state?.data?.searchInput;

		if (searchInput) {
			const trimmedFilter = searchInput?.trim().toLowerCase();
			return filteredOptions.filter(
				(option) => searchInput === '' ||
					option.label.toLowerCase().includes(trimmedFilter) /*||*/
				// (fieldDef?.inputSettings?.groupByCategory &&
				// 	option.category?.toLowerCase().includes(trimmedFilter)
				// )

			);
		}

		return options;
	}, [
		options,
		filteredOptions,
		state?.data?.searchInput,
		// fieldDef?.inputSettings?.groupByCategory
	]);

	// 	/**
	//    * Fills a Map with the options ensuring that categories
	//    * are not repeated.
	//    */
	// 	const optionsWithCategories = useMemo(() => {
	// 		if (fieldDef?.inputSettings?.groupByCategory) {
	// 			const categories = new Map();
	// 			filteredList.forEach((checkOption) => {
	// 				if (!categories.has(checkOption.category)) {
	// 					const categoryOptions = [checkOption];
	// 					categories.set(checkOption.category, categoryOptions);
	// 				} else {
	// 					const categoryOptions = categories.get(checkOption.category);
	// 					categoryOptions.push(checkOption);
	// 					categories.set(checkOption.category, categoryOptions);
	// 				}
	// 			});
	// 			return categories;
	// 		}
	// 	}, [fieldDef?.inputSettings?.groupByCategory, filteredList]);

	useEffect(() => {
		if (!isModalOpen) {
			onChange(state?.data.checkboxList);
		}
	}, [isModalOpen, state?.data.checkboxList]);

	// if (fieldDef?.inputSettings?.groupByCategory && optionsWithCategories instanceof Map) {
	// 	return Array.from(optionsWithCategories).map(([category, value]) => (
	// 		<CheckboxListWrapper key={`${category}-${value}`}>
	// 			<OptionsCheckedModalWrapper key={`${category}-${value}`} isModalOpen={isModalOpen}>
	// 				{category && <CategoryTitle>{category}</CategoryTitle>}
	// 				<CheckboxList
	// 					options={value}
	// 					checked={props.value}
	// 					onChange={onChangeCheckBoxList}
	// 					disabled={fieldDef?.disabled}
	// 				/>
	// 			</OptionsCheckedModalWrapper>
	// 		</CheckboxListWrapper>
	// 	));
	// } else {

	const searchInput = useCallback((props): ReactElement => {
		/**
		 * Handler for the input element
		 * @param e input change event
		 */
		const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
			dispatch(
				actions.setFieldValue({
					name: 'searchInput',
					value: e.target.value
				})
			);
		};

		/**
		 * Adds an options to the list.
		 */
		const createOption = async () => {
			// const newOption: optionsWithCategory = {
			// 	category: 'New Options',
			// 	value: `${props.value}_${options?.length}`,
			// 	label: props.value,
			// };

			const newOptionValue = await fieldDef?.inputSettings?.createNewOption(props.value);
			const newOption = {
				label: props.value,
				value: newOptionValue,
			}

			setFilteredOptions([...filteredOptions, newOption]);
		};

		return (
			<InputWrapper isMobileView={isMobileView}>
				<StyledInput
					type='text'
					placeholder='Search...'
					onChange={onInputChange}
					value={props.value ? props.value : ''}
					disabled={fieldDef?.disabled}
				/>
				{props.value && fieldDef?.inputSettings?.createNewOption && (
					<Button
						buttonType='blueText'
						disabled={fieldDef?.disabled}
						icon={AddIcon}
						onClick={createOption}
					>
						Create
					</Button>
				)}
			</InputWrapper>
		)
	}, [fieldDef?.disabled, options]);

	const deleteSelectedOption = (newOptions) => {
		dispatch(
			actions.setFieldValue({
				name: 'checkboxList',
				value: newOptions,
			})
		);
	}

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

			if (filter.prev === 'filter' && filter.new === 'options') {
				setOptions(newOptions);
			}

			if (filter.prev === 'options' && filter.new === 'options') {
				setOptions(options.concat(newOptions));
			}

			if (filter.prev === 'options' && filter.new === 'filter') {
				setFilteredOptions(newOptions);
			}

			if (filter.prev === 'filter' && filter.new === 'filter') {
				setFilteredOptions(filteredOptions.concat(newOptions));
			}
		}
	};

	const fields = useMemo(
		() => (
			[
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
					name: 'checkboxList',
					type: 'checkbox',
					disabled: fieldDef?.disabled,
					style: {
						height: '353px',
						overflowY: 'auto',
						flexWrap: 'nowrap',
						width: '100%',
					},
					size: '100%',
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
			] as FieldDef[]
		), [
		filteredList,
		searchInput,
		fieldDef,
		canLoadMore,
		getMoreOptions,
		isModalOpen,
		isMobileView,
	]
	);

	useMemo(() => {
		registerFields(fields);
	}, [fields, registerFields]);

	/**
   * Modal is closed when the Save button is clicked.
   */
	const handleSave = () => {
		handleCloseModal();

		onChange(state.data.checkboxList);
	};

	useMemo(() => {
		registerOnSubmit(handleSave);
	}, [handleSave, registerOnSubmit]);

	/**
   * Closes the modal and checks, if there are no
   * saved options then, empties the optionsChecked array, otherwise
   * optionsChecked remains with the last savedOptions.
   */
	const handleClose = () => {
		handleCloseModal();

		dispatch(
			actions.setFieldValue({ name: 'searchInput', value: undefined })
		);

		if (value?.length === 0) {
			dispatch(
				actions.setFieldValue({ name: 'checkboxList', value: undefined })
			);
			onChange(undefined);
		}
	};

	return (
		<DrawerContent
			title={fieldDef?.inputSettings?.modalTitle}
			onClose={handleClose}
		>
			<FormLayout
				formType='modal'
				state={state}
				dispatch={dispatch}
				fields={fields}
			/>
		</DrawerContent>
		// <Modal
		// 	title={fieldDef?.inputSettings?.modalTitle}
		// 	state={state}
		// 	dispatch={dispatch}
		// 	fields={fields}
		// 	open={isModalOpen}
		// 	onCancel={handleClose}
		// 	onSubmit={handleSave}
		// 	submitButtonAttrs={{ children: 'Save' }}
		// 	cancelButtonAttrs={{ children: 'Cancel' }}
		// />
	);
};

export default memo(AdvancedSelectionModal);