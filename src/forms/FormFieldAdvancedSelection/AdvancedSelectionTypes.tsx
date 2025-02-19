import { GetOptions } from "@root/components/DataViewFilterMultiselect";
import { FieldDefBase } from "@root/components/Field";
import { MosaicLabelValue } from "@root/types";

export type optionsWithCategory = {
	category?: string;
} & MosaicLabelValue;

type AdvancedSelectionBasic = {
	createNewOption?: (filter: string) => Promise<MosaicLabelValue>;
	selectLimit?: number;
}

export type AdvancedSelectionLocalOptions = {
	/**
	* Options to be display within the Modal.
	*/
	options: MosaicLabelValue[];
} & AdvancedSelectionBasic;

export type AdvancedSelectionExternalOptions = {
	/**
	 * Used to get the selected options on the parent component.
	 */
	getOptions: GetOptions
	getOptionsLimit?: number;
} & AdvancedSelectionBasic;

export type AdvancedSelectionInputSettings = AdvancedSelectionLocalOptions | AdvancedSelectionExternalOptions;

export interface ChipListPropsTypes {
	fieldDef: {
		inputSettings: {
			isModalOpen: boolean;
			isMobileView: boolean;
			deleteSelectedOption: (options: MosaicLabelValue[]) => Promise<void>;
		};
		disabled: boolean;
	},
	value: MosaicLabelValue[];
}

export interface AdvanceSelectionDrawerPropTypes {
	value: MosaicLabelValue[];
	fieldDef: FieldDefBase<"advancedSelection", AdvancedSelectionInputSettings, AdvancedSelectionData>;
	onChange: (e: MosaicLabelValue[]) => Promise<void>;
	isModalOpen: boolean;
	isMobileView: boolean;
	handleClose: (save?: boolean) => Promise<void>;
	handleUnsavedChanges?: (val: boolean) => void;
	dialogOpen?: boolean;
	handleDialogClose?: (val: boolean) => void;
}

export type AdvancedSelectionData = MosaicLabelValue[];

export type FieldDefAdvancedSelection = FieldDefBase<"advancedSelection", AdvancedSelectionInputSettings, AdvancedSelectionData>
