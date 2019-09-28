import React from "react";
import styled from "styled-components";

import GridTHead from "./GridTHead.jsx";
import GridTBody from "./GridTBody.jsx";

const StyledTable = styled.table`
	width: 100%;
	border-collapse: collapse;
`

function GridListView(props) {
	return (
		<StyledTable>
			<GridTHead
				checked={props.checked}
				columns={props.columns}
				bulkActions={props.bulkActions}
				sort={props.sort}
				onSortClick={props.onSortClick}
				onBulkActionClick={props.onBulkActionClick}
				onCheckAllClick={props.onCheckAllClick}
			/>
			<GridTBody
				checked={props.checked}
				columns={props.columns}
				data={props.data}
				bulkActions={props.bulkActions}
				additionalActions={props.additionalActions}
				primaryActions={props.primaryActions}
				onActionClick={props.onActionClick}
				onCheckboxClick={props.onCheckboxClick}
			/>
		</StyledTable>
	)
}

export default GridListView;