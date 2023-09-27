import { L } from '../../../lib/abpUtility';

const rules = {
  courseName: [{ required: true, message: L('ThisFieldIsRequired') }],
  courseFee: [{ required: true, message: L('ThisFieldIsRequired') }],
  quantity: [{ required: true, message: L('ThisFieldIsRequired') }],
};
export default rules;
