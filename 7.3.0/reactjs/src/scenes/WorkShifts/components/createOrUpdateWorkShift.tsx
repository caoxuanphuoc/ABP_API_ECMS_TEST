import { Input, Modal, TimePicker } from 'antd';
import Form, { FormInstance } from 'antd/lib/form';
import React from 'react';
import { L } from '../../../lib/abpUtility';
import rules from './createOrUpdateWorkShift.validation';

type PickerType = 'time';

export interface ICreateOrUpdateWorkShiftProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  formRef: React.RefObject<FormInstance>;
}

interface ICreateOrUpdateWorkShiftState {
  type: PickerType;
}

class CreateOrUpdateWorkShift extends React.Component<
  ICreateOrUpdateWorkShiftProps,
  ICreateOrUpdateWorkShiftState
> {
  constructor(props: Readonly<ICreateOrUpdateWorkShiftProps>) {
    super(props);
    this.state = {
      type: 'time',
    };
  }

  render() {
    const { visible, onCancel, onCreate, formRef } = this.props;
    const { type } = this.state;

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
        title="WorkShift"
        destroyOnClose
      >
        <Form ref={formRef}>
          <Form.Item label={L('Code')} {...formItemLayout} name="code" rules={rules.code}>
            <Input />
          </Form.Item>
          <Form.Item
            label={L('TimeStart')}
            {...formItemLayout}
            name="timeStart"
            rules={rules.timeStart}
            valuePropName={type}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            label={L('TimeEnd')}
            {...formItemLayout}
            name="timeEnd"
            rules={rules.timeEnd}
            valuePropName={type}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateWorkShift;
