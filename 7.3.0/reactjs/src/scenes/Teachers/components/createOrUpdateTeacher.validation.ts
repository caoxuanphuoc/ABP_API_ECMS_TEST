import { L } from "../../../lib/abpUtility";

const rules = {
    schoolName: [{ required: true, mesage: L('ThisFieldIsRequired') }],
    certificate: [{ required: true, message: L('ThisFieldIsRequired') }],
    wage: [{ required: true, message: L('ThisFieldIsRequired') }],
  };
  
  export default rules;