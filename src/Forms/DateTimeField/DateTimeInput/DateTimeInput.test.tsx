import { render } from '@testing-library/react';
import * as React from 'react';
import DateTimeInput from '../DateTimeInput';
//import * as DateFnsUtils from '@date-io/date-fns' // Works for test not for UI

describe('DateTimeInput component', () => {
	/* it('should should display the date picker component', () => {
		const { getByText } = render(
			<DateTimeInput
				utils={DateFnsUtils}
				disabled={false}
				value={new Date('2018-01-01T00:00:00.000Z')}
				onChange={() => jest.fn()}
			/>
		);
	}); */

	it('should should display the date value', () => {
		const { getByText } = render(
			<DateTimeInput
				disabled={true}
				dateValue={new Date('2018-01-01T00:00:00.000Z')}
				timeValue={new Date('2018-01-01T00:00:00.000Z')}
				onChangeDate={() => jest.fn()}
				onChangeTime={() => jest.fn()}
			/>
		);

		expect(getByText('12:00 AM')).toBeTruthy();
		expect(getByText('1/1/2018')).toBeTruthy();
	});

	it('should display the placeholder when is disabled and no value is provided', () => {
		const { getByText } = render(
			<DateTimeInput
				disabled={true}
				dateValue={null}
				timeValue={null}
				onChangeDate={() => jest.fn()}
				onChangeTime={() => jest.fn()}
			/>
		);

		expect(getByText('Start')).toBeTruthy();
		expect(getByText('00:00 AM/PM')).toBeTruthy();
	})
});
