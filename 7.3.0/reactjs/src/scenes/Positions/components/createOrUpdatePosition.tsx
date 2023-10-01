import { FormInstance } from 'antd/lib/form';
import React from 'react';
import { Modal, Form, Input } from 'antd';
import { L } from '../../../lib/abpUtility';

export interface ICreateOrUpdatePositionProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  formRef: React.RefObject<FormInstance>;
}

class CreateOrUpdatePosition extends React.Component<ICreateOrUpdatePositionProps> {
  render() {
    const { visible, onCancel, onCreate, formRef } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
        md: { span: 6 },
        lg: { span: 6 },
        xl: { span: 6 },
        xxl: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
        md: { span: 18 },
        lg: { span: 18 },
        xl: { span: 18 },
        xxl: { span: 18 },
      },
    };

    return (
      <Modal
        visible={visible}
        cancelText={L('Cancel')}
        okText={L('OK')}
        onCancel={onCancel}
        onOk={onCreate}
        title="Position"
        destroyOnClose
      >
        <Form ref={formRef}>
          <Form.Item
            label={L('PositionName')}
            {...formItemLayout}
            name="positionName"
            rules={[
              {
                required: true,
                message: L('ThisFieldIsRequired'),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdatePosition;
