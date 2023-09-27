import { L } from '../../../lib/abpUtility';

const validValue = (rule: any, value: any) => {
  if (value === 'Select Course') {
    return Promise.reject('Please select value for Course');
  }
  return Promise.resolve();
};

const rules = {
  course: [{ required: true, message: L('ThisFieldIsRequired') }, { validValue: validValue }],
  startDate: [{ required: true, message: L('ThisFieldIsRequired') }],
  endDate: [{ required: true, message: L('ThisFieldIsRequired') }],
  limitStudent: [{ required: true, message: L('ThisFieldIsRequired') }],
};

export default rules;
