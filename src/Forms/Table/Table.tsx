import * as React from 'react';
import { memo, ReactElement, useMemo, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { TableDef, TableRow } from './TableTypes';
import { MosaicFieldProps } from '@root/components/Field';

// Components
import AddIcon from '@material-ui/icons/Add';
import Button from '@root/forms/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import EditIcon from '@material-ui/icons/Edit';

// Styles
import {
	AddButton,
	AddElementContainer,
	Container,
	StyledIconButton,
	StyledTable,
	StyledTr,
	TableContainer,
	Td,
	TdDrag,
	Th,
	ThDrag,
	THead,
	TrHead,
} from './Table.styled';

const Table = (props: MosaicFieldProps<TableDef, TableRow[]>): ReactElement => {
	const { fieldDef, value, onChange } = props;

	// State varialbles
	const [isDragging, setIsDragging] = useState(false);
	const [rows, setRows] = useState([]);

	useMemo(() => {
		if (value) setRows(value);
		else setRows([]);
	}, [value]);

	/**
	 * When a drag has ended the rows are updated
	 * @param e drag event.
	 */
	const handleDragEnd = (e) => {
		if (!e.destination) return;

		const rowDataCopy = [...rows];
		const [source_data] = rowDataCopy.splice(e.source.index, 1);
		rowDataCopy.splice(e.destination.index, 0, source_data);
		setIsDragging(false);
		setRows(rowDataCopy);
		onChange(rowDataCopy);
	};

	/**
   * When a row is being dragged the dragging state is set to true.
   */
	const handleDragStart = () => {
		setIsDragging(true);
	};

	/**
   * Removes a row and if an external delete callback is passed
   * through the props, it will be executed.
   * @param rowIndex of the row that is going to be deleted.
   */
	const deleteRow = (rowIndex: number) => {
		if (fieldDef?.inputSettings?.handleDelete) {
			fieldDef?.inputSettings?.handleDelete(rowIndex);
		}

		let rowDataCopy = [...rows];
		rowDataCopy.splice(rowIndex, 1);

		if (rowDataCopy.length === 0) rowDataCopy = undefined;

		setRows(rowDataCopy);
		onChange(rowDataCopy);
	};

	/**
	 * Renders empty row headers when the lenght of
	 * the array of headers does not match with the
	 * number of cells of a row.
	 */
	const renderEmptyHeaders = useMemo(() => {
		const emptyHeaders = [];
		const itemsLengths = rows?.map((row) =>
			row?.items?.length ? row?.items?.length : 0
		);

		const maxRowItems = Math.max(...itemsLengths);
		const headersToAdd = maxRowItems - fieldDef?.inputSettings?.headers.length;
		if (headersToAdd > 0) {
			for (let i = 0; i < headersToAdd; i++) {
				emptyHeaders.push(<Th key={`empty-header-${i}`}></Th>);
			}
		}

		return emptyHeaders;
	}, [fieldDef?.inputSettings?.headers, rows]);

	/**
	 * Executes the add element callback function
	 * when the add button is clicked. 
	 * @param e onClick event
	 */
	const addElement = (e) => {
		e.preventDefault();
		fieldDef?.inputSettings?.handleAddElement();
	};

	return (
		<>
			{rows?.length === 0 ? (
				<AddElementContainer>
					<Button
						disabled={fieldDef?.disabled}
						buttonType='secondary'
						onClick={(e) => addElement(e)}
					>
            ADD ELEMENT
					</Button>
				</AddElementContainer>
			) : (
				<TableContainer>
					<AddButton
						buttonType='blueText'
						disabled={fieldDef?.disabled}
						icon={AddIcon}
						onClick={(e) => addElement(e)}
					>
            Add Element
					</AddButton>
					<DragDropContext
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<Container>
							<StyledTable>
								<THead>
									<TrHead>
										<ThDrag></ThDrag>
										<Th>Actions</Th>
										{fieldDef?.inputSettings?.headers.map((header, index) => (
											<Th key={`${header}-${index}`}>{header}</Th>
										))}
										{renderEmptyHeaders}
									</TrHead>
								</THead>
								<Droppable droppableId='droppable-rows'>
									{(provider) => (
										<tbody ref={provider.innerRef} {...provider.droppableProps}>
											{rows?.map((row, rowIndex) => (
												<Draggable
													key={row.id}
													draggableId={row.id ? row.id : rowIndex}
													index={rowIndex}
													isDragDisabled={fieldDef?.disabled}
												>
													{(provider) => (
														<StyledTr
															{...provider.draggableProps}
															ref={provider.innerRef}
															isDragging={isDragging}
														>
															<TdDrag {...provider.dragHandleProps}>
																<DragIndicatorIcon />
															</TdDrag>
															<Td>
																<StyledIconButton
																	disabled={fieldDef?.disabled}
																	icon={EditIcon}
																	onClick={() =>
																		fieldDef?.inputSettings?.handleEdit(
																			rowIndex
																		)
																	}
																/>
																<StyledIconButton
																	disabled={fieldDef?.disabled}
																	icon={DeleteIcon}
																	onClick={() => deleteRow(rowIndex)}
																/>
																{fieldDef?.inputSettings?.extraActions?.length > 0 && (
																	<>
																		{fieldDef?.inputSettings?.extraActions.map(
																			(action, index) => (
																				<StyledIconButton
																					disabled={fieldDef?.disabled}
																					key={`${action.label}-${index}`}
																					icon={action.icon}
																					onClick={() =>
																						action.actionFnc(rowIndex)
																					}
																				/>
																			)
																		)}
																	</>
																)}
															</Td>
															{row.items.map((item) => (
																<Td key={item}>{item}</Td>
															))}
														</StyledTr>
													)}
												</Draggable>
											))}
											{provider.placeholder}
										</tbody>
									)}
								</Droppable>
							</StyledTable>
						</Container>
					</DragDropContext>
				</TableContainer>
			)}
		</>
	);
};

export default memo(Table);
