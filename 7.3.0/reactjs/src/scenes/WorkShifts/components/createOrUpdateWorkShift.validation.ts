import { L } from '../../../lib/abpUtility';

const rules = {
  code: [{ required: true, mesage: L('ThisFieldIsRequired') }],
  timeStart: [{ required: true, message: L('ThisFieldIsRequired') }],
  timeEnd: [{ required: true, message: L('ThisFieldIsRequired') }],
};

export default rules;
