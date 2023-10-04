import { L } from '../../../lib/abpUtility';

const rules = {
  offTimes: [{ required: true, message: L('ThisFieldIsRequired') }],
  dateStart: [{ required: true, message: L('ThisFieldIsRequired') }],
};

export default rules;
