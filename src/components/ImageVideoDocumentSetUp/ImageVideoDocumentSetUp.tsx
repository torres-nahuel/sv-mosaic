import * as React from 'react';
import { memo, useState, useMemo, ReactElement } from 'react';

// Components
import Button from '@root/forms/Button';
import Label from '@root/components/Field/Label';

// Types
import { ImageVideoDocumentSetUpProps } from '.';
import {
	AssetCard,
	AssetLabel,
	AssetLabelTooltip,
	AssetPropertiesColumn,
	ButtonsWrapper,
	Column,
	MenuColumn,
	MoreText,
	TableRow,
	Td,
	SetUpButtonsWrapper,
	StyledMenu,
	StyledTooltip,
} from './ImageVideoDocumentSetUp.styled';

// Material UI
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';

// Components
import IconButton from '@root/components/IconButton';

const ImageVideoDocumentSetUp = (
	props: ImageVideoDocumentSetUpProps
): ReactElement => {
	const {
		assetProperties,
		label,
		handleBrowse,
		handleEdit,
		handleRemove,
		handleSetDocument,
		handleSetImage,
		handleSetVideo,
		handleTranslate,
		src,
	} = props;

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const closeMenuHandler = () => {
		setAnchorEl(null);
	};

	let multipleActions = false;

	if (
		(handleSetImage && handleSetVideo) ||
    (handleSetVideo && handleSetDocument) ||
    (handleSetDocument && handleSetImage)
	) {
		multipleActions = true;
	}

	const iconMenu = (
		<>
			<IconButton
				data-testid='icon-button-test'
				icon={MoreVertIcon}
				onClick={handleClick}
			/>
			<StyledMenu
				anchorEl={anchorEl}
				getContentAnchorEl={null}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				keepMounted
				open={open}
				onClose={closeMenuHandler}
			>
				<MenuItem onClick={handleEdit}>Edit</MenuItem>
				<MenuItem onClick={handleTranslate}>Translate</MenuItem>
			</StyledMenu>
		</>
	);

	const tootltipContent = useMemo(
		() =>
			assetProperties.map((property) => (
				<TableRow key={`${property.label}-${property.value}`}>
					<Td><AssetLabelTooltip>{property.label}</AssetLabelTooltip></Td>
					<Td>{property.value}</Td>
				</TableRow>
			)),
		[assetProperties]
	);

	const showMore = (
		<StyledTooltip
			placement='top'
			text={
				<table>
					<tbody>{tootltipContent}</tbody>
				</table>
			}
			type='advanced'
		>
			<MoreText>More</MoreText>
		</StyledTooltip>
	);

	// Only show the first four asset's properties on the card
	const assetPropertiesRows = useMemo(
		() =>
			assetProperties.slice(0, 4).map((property, idx) => (
				<TableRow key={`${property.label}-${property.value}`}>
					<Td><AssetLabel>{property.label}</AssetLabel></Td>
					<Td>{property.value}{idx === 3 && <>...{showMore}</>}</Td>
				</TableRow>
			)),
		[assetProperties]
	);

	return (
		<div>
			<Label>{label}</Label>
			{assetProperties.length === 0 ? (
				<SetUpButtonsWrapper multipleActions={multipleActions}>
					{handleSetImage && (
						<Button buttonType='secondary' onClick={handleSetImage}>
							SET IMAGE
						</Button>
					)}
					{handleSetVideo && (
						<Button buttonType='secondary' onClick={handleSetVideo}>
							SET VIDEO
						</Button>
					)}
					{handleSetDocument && (
						<Button buttonType='secondary' onClick={handleSetDocument}>
              SET DOCUMENT
						</Button>
					)}
				</SetUpButtonsWrapper>
			) : (
				<AssetCard>
					{src && (
						<Column>
							<img
								src={src}
								data-testid='image-test'
								width={261}
								height={172}
							/>
						</Column>
					)}
					<AssetPropertiesColumn>
						<table>
							<tbody>
								{assetPropertiesRows}
							</tbody>
						</table>
					</AssetPropertiesColumn>
					<MenuColumn>{iconMenu}</MenuColumn>
					<ButtonsWrapper>
						<Button buttonType='blueText' onClick={handleBrowse}>
              Browse
						</Button>
						<Button buttonType='redText' onClick={handleRemove}>
              Remove
						</Button>
					</ButtonsWrapper>
				</AssetCard>
			)}
		</div>
	);
};

export default memo(ImageVideoDocumentSetUp);
