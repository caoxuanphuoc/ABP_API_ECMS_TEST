import { L } from "../../../lib/abpUtility";

const rules = {
    roomName: [{ required: true, mesage: L('ThisFieldIsRequired') }],
    maxContainer: [{ required: true, message: L('ThisFieldIsRequired') }],
  };
  
  export default rules;