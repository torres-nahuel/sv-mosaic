import React from "react";
import styled from "styled-components";

import Checkbox from "../Checkbox";
import GridActionsButtonRow from "../internal/GridActionsButtonRow";
import theme from "../../utils/theme.js";
import DataViewBulkActionsButtonsRow from "./DataViewBulkActionsButtonsRow";
import DataViewDisplayGridSortControl from "./DataViewDisplayGridSortControl";

const StyledDiv = styled.div`
	& > .topRow {
		margin-bottom: 4px;
		position: sticky;
		top: 0;
		z-index: 1;
		background: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	${/* Borders on sticky elements don't carry through, so we put them on the :after element */""}
	& > .topRow:after {
		content: "";
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border-bottom: ${theme.borders.gray};
		pointer-events: none;
	}

	& > .grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-column-gap: 8px;
		grid-row-gap: 20px;
	}
	
	& > .grid > .cell {
		min-width: 0;
	}
	
	& > .grid > .cell.checked > .image > .checkboxContainer {
		opacity: 1;
	}
	
	& > .grid > .cell.checked > .image > .checkboxContainer > .mask {
		opacity: 1;
		border: 2px solid rgba(255, 255, 255, .5);
		margin: 6px;
	}
	
	& > .grid > .cell > img {
		max-width: 100%;
		min-width: 100%;
	}
	
	& > .grid > .cell h2 {
		margin: 0;
		font-size: 14px;
		font-weight: normal;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	
	& > .grid > .cell h3 {
		margin: 0;
		font-weight: normal;
		font-size: 12px;
		color: ${theme.colors.gray500};
	}
	
	& > .grid > .cell .image {
		position: relative;
	}
	
	& > .grid > .cell > .image > .checkboxContainer {
		opacity: 0;
		position: absolute;
		top: 0px;
		left: 0px;
		transition: opacity 150ms;
	}
	
	& > .grid > .cell > .image:hover > .checkboxContainer {
		opacity: 1;
	}
	
	& > .grid > .cell > .image > .checkboxContainer > .mask {
		position: absolute;
		width: 18px;
		height: 18px;
		left: 4px;
		top: 4px;
		margin: 8px;
		background: white;
		border-radius: 3px;
		opacity: .8;
	}
	
	& > .grid > .cell .image img {
		width: 100%;
	}
	
	& > .grid > .cell .info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 100%;
	}
	
	& > .grid > .cell > .info > .left {
		min-width: 0;
	}
	
	& > .grid > .cell > .info > .right {
		flex-shrink: 0;
	}
`

function DataViewDisplayGrid(props) {
	// TODO VALIDATE PROPS
	const columnMap = props.displaySettings && props.displaySettings.columnMap;
	if (!columnMap) {
		throw new Error("You must specify displaySettings.columnMap in order to use the grid view.");
	}

	const checkboxClick = (i) => () => {
		props.onCheckboxClick(i);
	}
	
	const allChecked = props.checked.length > 0 && props.checked.every(val => val === true);
	const anyChecked = props.checked.length > 0 && props.checked.some(val => val === true);

	const hasTopRow = props.bulkActions !== undefined || props.onSortChange !== undefined;
	const hasSortControl = props.onSortChange !== undefined && props.sort !== undefined;

	return (
		<StyledDiv>
			{
				hasTopRow &&
				<div className="topRow">
					<div className="left">
						{
							props.bulkActions &&
							<Checkbox
								checked={allChecked}
								onClick={props.onCheckAllClick}
							/>
						}
						{
							props.bulkActions && anyChecked &&
							<DataViewBulkActionsButtonsRow data={props.data} checked={props.checked} bulkActions={props.bulkActions}/>
						}
					</div>
					{
						hasSortControl &&
						<div className="right">
							<DataViewDisplayGridSortControl
								columns={props.columns}
								sort={props.sort}
								displaySettings={props.displaySettings}
								onSortChange={props.onSortChange}
							/>
						</div>
					}
				</div>
			}
			<div className="grid">
				{
					props.data.map((row, i) => {
						const image = row[columnMap.image];
						const primary = row[columnMap.primary];
						const secondary = row[columnMap.secondary];

						return (
							<div
								className={`
									cell
									${props.checked[i] === true ? "checked" : ""}
								`}
								key={row.id}
							>
								{
									image &&
									<div className="image">
										{
											props.bulkActions &&
											<div className="checkboxContainer">
												<div className="mask"/>
												<Checkbox
													className="checkbox"
													checked={props.checked[i] === true}
													onClick={checkboxClick(i)}
												/>
											</div>
										}
										{image}
									</div>
								}
								<div className="info">
									<div className="left">
										{
											primary &&
											<h2>{primary}</h2>
										}
										{
											secondary &&
											<h3>{secondary}</h3>
										}
									</div>
									<div className="right">
										<GridActionsButtonRow
											primaryActions={props.primaryActions}
											additionalActions={props.additionalActions}
											row={row}
										/>
									</div>
								</div>
							</div>
						)
					})
				}
			</div>
		</StyledDiv>
	)
}

export default DataViewDisplayGrid;