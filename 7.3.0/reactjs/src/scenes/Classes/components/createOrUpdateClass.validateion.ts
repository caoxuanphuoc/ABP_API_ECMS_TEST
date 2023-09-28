import { L } from '../../../lib/abpUtility';

const rules = {
  startDate: [{ required: true, message: L('ThisFieldIsRequired') }],
  endDate: [{ required: true, message: L('ThisFieldIsRequired') }],
  limitStudent: [{ required: true, message: L('ThisFieldIsRequired') }],
};

export default rules;
