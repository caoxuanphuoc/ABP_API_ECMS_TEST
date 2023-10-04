import { Modal, Form, Input, DatePicker, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React from 'react';
import { L } from '../../../lib/abpUtility';
import ClassStore from '../../../stores/classStore';
import UserStore from '../../../stores/userStore';

type PickerType = 'date';

export interface ICreateOrUpdateUserClassProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  isActive: boolean;
  formRef: React.RefObject<FormInstance>;
  selectedClassId: number;
  classStore: ClassStore;
  selectedUserId: number;
  userStore: UserStore;
}

export interface ICreateOrUpdateUserClassState {
  type: PickerType;
}

class CreateOrUpdateUserClass extends React.Component<
  ICreateOrUpdateUserClassProps,
  ICreateOrUpdateUserClassState
> {
  constructor(props: Readonly<ICreateOrUpdateUserClassProps>) {
    super(props);
    this.state = {
      type: 'date',
    };
  }

  async componentDidMount() {
    this.getAll();
  }

  async getAll() {
    const { classStore, userStore } = this.props;
    await classStore.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword: '',
    });

    await userStore.getAll({
      maxResultCount: 10,
      skipCount: 0,
      keyword: '',
    });
  }

  validValueClass = (rule: any, value: any) => {
    if (value === 'Select Class') {
      return Promise.reject('Please select value for Class');
    }
    return Promise.resolve();
  };

  validValueUser = (rule: any, value: any) => {
    if (value === 'Select User') {
      return Promise.reject('Please select value for User');
    }
    return Promise.resolve();
  };

  render() {
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
    const {
      visible,
      onCancel,
      onCreate,
      formRef,
      modalType,
      selectedClassId,
      classStore,
      selectedUserId,
      userStore,
    //   isActive,
    } = this.props;
    const classRooms = classStore.classes === undefined ? [] : classStore.classes.items;
    const users = userStore.users === undefined ? [] : userStore.users.items;
    const { type } = this.state;

    return (
      <Modal
        visible={visible}
        cancelText={L('Cancel')}
        okText={L('OK')}
        onCancel={onCancel}
        onOk={onCreate}
        title="UserClass"
        destroyOnClose
      >
        <Form
          ref={formRef}
          initialValues={{
            classId: modalType === 'create' ? 'Select Class' : selectedClassId,
            userId: modalType === 'create' ? 'Select User' : selectedUserId,
          }}
        >
          <Form.Item
            label={L('UserId')}
            {...formItemLayout}
            name="userId"
            rules={[
              {
                required: true,
                message: 'Please select a user',
              },
              {
                validator: this.validValueUser,
              },
            ]}
          >
            <Select
              style={{ width: 350 }}
              //   onChange={handleChangeValue}
              options={users.map((user) => ({
                key: user.id,
                value: user.id,
                label: user.fullName,
              }))}
            />
          </Form.Item>
          <Form.Item
            label={L('Class')}
            {...formItemLayout}
            name="classId"
            rules={[
              {
                required: true,
                message: 'Please select a class',
              },
              {
                validator: this.validValueClass,
              },
            ]}
          >
            <Select
              style={{ width: 350 }}
              //   onChange={handleChangeValue}
              options={classRooms.map((classRoom) => ({
                key: classRoom.id,
                value: classRoom.id,
                label: classRoom.code,
              }))}
            />
          </Form.Item>
          <Form.Item label={L('OffTimes')} {...formItemLayout} name="offTimes">
            <Input />
          </Form.Item>
          <Form.Item
            label={L('DateStart')}
            {...formItemLayout}
            name="dateStart"
            rules={[
              {
                required: true,
                message: 'Please select a date start',
              },
              {
                validator: (rule, value) => {
                  if (!value || !value.isValid || !value.isValid()) {
                    return Promise.reject('Please select a valid date start');
                  }
                  return Promise.resolve();
                },
              },
            ]}
            valuePropName={type}
          >
            <DatePicker />
          </Form.Item>
          {/* <Form.Item name="isActive" hidden>
            <Checkbox value={isActive} />
          </Form.Item> */}
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateUserClass;
