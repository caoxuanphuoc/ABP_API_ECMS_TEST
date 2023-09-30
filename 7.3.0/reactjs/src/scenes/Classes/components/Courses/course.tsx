import React from 'react';
import { Form, Input, Modal } from 'antd';
import { CourseCreen } from './courseScreen';
import { L } from '../../../../lib/abpUtility';
import AppComponentBase from '../../../../components/AppComponentBase';

export interface ICourseProps {
  visible: boolean;
  onCancel: () => void;
  course: CourseCreen;
}

class Course extends AppComponentBase<ICourseProps> {
  render() {
    const { visible, onCancel, course } = this.props;

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
        onOk={onCancel}
        title={`Course - ${course.code}`}
        destroyOnClose
      >
        <Form>
          <Form.Item label={L('CourseName')} {...formItemLayout}>
            <Input value={course.courseName} />
          </Form.Item>
          <Form.Item label={L('CourseFee')} {...formItemLayout}>
            <Input value={course.courseFee} suffix="VNĐ" />
          </Form.Item>
          <Form.Item label={L('Quantity')} {...formItemLayout}>
            <Input value={course.quantity} />
          </Form.Item>
          <Form.Item label={L('LimitStudent')} {...formItemLayout}>
            <Input value={course.limitStudent} />
          </Form.Item>
          <Form.Item label={L('CurrentStudent')} {...formItemLayout}>
            <Input value={course.currentStudent} />
          </Form.Item>
          <Form.Item label={L('LessionTimes')} {...formItemLayout}>
            <Input value={course.lessionTimes} />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Course;
