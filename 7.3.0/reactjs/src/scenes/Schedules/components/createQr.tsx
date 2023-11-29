import React from 'react';
import { Modal } from 'antd';
import QRCode from 'react-qr-code';
import { L } from '../../../lib/abpUtility';

export interface ICreateQrProps {
  hashSchedule: any;
  visible: boolean;
  onCancel: () => void;
}

// eslint-disable-next-line react/prefer-stateless-function
class CreateQr extends React.Component<ICreateQrProps> {
  
  render() {
    const { visible, onCancel, hashSchedule } = this.props;

    return (
      <Modal
        visible={visible}
        title="Generate QR Code"
        destroyOnClose
        cancelText={L('Cancel')}
        okText={L('OK')}
        onCancel={onCancel}
        onOk={onCancel}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <QRCode value={hashSchedule || "nothing"} />
      </Modal>
    );
  }
}

export default CreateQr;
