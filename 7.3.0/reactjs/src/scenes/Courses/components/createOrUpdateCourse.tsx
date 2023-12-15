import { Modal, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React from 'react';
import { L } from '../../../lib/abpUtility';
import rules from './createOrUpdateCourse.validation';

export interface ICreateOrUpdateCourseProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  formRef: React.RefObject<FormInstance>;
}

class CreateOrUpdateCourse extends React.Component<ICreateOrUpdateCourseProps> {
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
        title="WorkShift"
        destroyOnClose
      >
        <Form ref={formRef}>
          <Form.Item
            label={L('CourseName')}
            {...formItemLayout}
            name="courseName"
            rules={rules.courseName}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            label={L('CourseFee')}
            {...formItemLayout}
            name="courseFee"
            rules={rules.courseFee}
          >
            <Input suffix="VNĐ" />
          </Form.Item>
          <Form.Item
            label={L('Quantity')}
            {...formItemLayout}
            name="quantity"
            rules={rules.quantity}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateCourse;
