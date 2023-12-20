import React from 'react';
import { Button, Col, DatePicker, Form, Row, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { WorkShiftDto } from '../../../services/schedule/dto/workShiftDto';
import { DayOfWeek, DayOfTheWeek } from '../../../services/schedule/dto/dateOfTheWeek';
import { Shift, shiftNames } from '../../../services/schedule/dto/shift';
import { L } from '../../../lib/abpUtility';

interface DynamicFieldSetProps {
  onUpdateLsWorkSheet: (newLsWorkSheet: WorkShiftDto[]) => void;
  // scheduleItem: any;
}

interface DynamicFieldSetState {
  fields: {
    key: string;
    dateOfWeek: DayOfTheWeek;
    shiftTime: Shift;
    startDate: Date;
    endDate: Date;
  }[];
}

class DynamicFieldSet extends React.Component<DynamicFieldSetProps, DynamicFieldSetState> {
  constructor(props: DynamicFieldSetProps) {
    super(props);
    // const { scheduleItem } = props;

    // const fields =
    //   scheduleItem && scheduleItem.length > 0
    //     ? scheduleItem.map((item: GetScheduleOutput) => ({
    //         key: Math.random().toString(36).substring(2),
    //         dateOfWeek: mapDayOfWeek(item.dayOfWeek.toString()),
    //         shiftTime: mapShiftTime(item.shift.toString()),
    //       }))
    //     : [{ key: '', dateOfWeek: DayOfTheWeek.Monday, shiftTime: Shift.Tiet_1_2 }];
    const fields = [
      {
        key: '',
        dateOfWeek: DayOfTheWeek.Monday,
        shiftTime: Shift.Tiet_1_2,
        startDate: new Date(),
        endDate: new Date(),
      },
    ];

    this.state = {
      fields,
    };
  }

  // componentDidUpdate(prevProps: Readonly<DynamicFieldSetProps>, prevState: Readonly<DynamicFieldSetState>, snapshot?: any): void {
  //   const { fields } = this.state;
  //   const { onUpdateLsWorkSheet } = this.props;
  //   if(prevState.fields !== fields) {
  //     const formattedListWorkSheets = fields.map(({ dateOfWeek, shiftTime }) => ({
  //       dateOfWeek,
  //       shiftTime,
  //     }));
  //     onUpdateLsWorkSheet(formattedListWorkSheets);
  //   }
  // }

  handleAddField = () => {
    const { fields } = this.state;

    const newKey = Math.random().toString(36).substring(2);
    const newFields = [
      ...fields,
      {
        key: newKey,
        dateOfWeek: DayOfTheWeek.Monday,
        shiftTime: Shift.Tiet_1_2,
        startDate: new Date(),
        endDate: new Date(),
      },
    ];
    this.setState({ fields: newFields }, this.updateFormattedLsWorkSheet);
  };

  handleRemoveField = (keyToRemove: string) => {
    const { fields } = this.state;
    const newFields = fields.filter((field) => field.key !== keyToRemove);
    this.setState({ fields: newFields }, this.updateFormattedLsWorkSheet);
  };

  handleDayOfWeekChange = (key: string, dateOfWeek: DayOfTheWeek): void => {
    this.updateField(key, { dateOfWeek });
  };

  handleShiftChange = (key: string, shiftTime: Shift): void => {
    this.updateField(key, { shiftTime });
  };

  selectedStartDate = (key: string, date: any) => {
    this.updateField(key, { startDate: date });
  };

  selectedEndDate = (key: string, date: any) => {
    this.updateField(key, { endDate: date });
  };

  updateField = (
    key: string,
    updatedValues: Partial<{
      dateOfWeek: DayOfTheWeek;
      shiftTime: Shift;
      startDate: Date;
      endDate: Date;
    }>
  ): void => {
    const { fields } = this.state;
    const newFields = fields.map((field) =>
      field.key === key ? { ...field, ...updatedValues } : field
    );
    this.setState({ fields: newFields }, this.updateFormattedLsWorkSheet);
  };

  updateFormattedLsWorkSheet = (): void => {
    const { fields } = this.state;
    const { onUpdateLsWorkSheet } = this.props;
    const formattedListWorkSheets = fields.map(({ dateOfWeek, shiftTime, startDate, endDate }) => ({
      dateOfWeek,
      shiftTime,
      startDate,
      endDate,
    }));
    onUpdateLsWorkSheet(formattedListWorkSheets);
  };

  validateStartDate = (rule: any, value: any) => {
    const now = moment().startOf('day');
    if (!moment.isMoment(value) || !value.isValid()) {
      return Promise.reject(new Error('Please select a valid start date'));
    }

    if (value.isBefore(now)) {
      return Promise.reject(
        new Error('Start date must be greater than or equal to the current date')
      );
    }

    return Promise.resolve();
  };

  render() {
    const { fields } = this.state;

    return (
      <>
        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={this.handleAddField}
          />
        </div>
        {fields.map((field) => (
          <Form.Item key={field.key}>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Form.Item
                  label={L('Start Date')}
                  name={['startDate']}
                  rules={[
                    {
                      required: true,
                      message: 'Please select a start date',
                    },
                    {
                      validator: this.validateStartDate,
                    },
                  ]}
                  valuePropName="date"
                >
                  <DatePicker
                    onChange={(date) => this.selectedStartDate(field.key, date)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={L('End Date')}
                  name={['endDate']}
                  rules={[
                    {
                      required: true,
                      message: 'Please select an end date',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startDate = getFieldValue('startDate');

                        if (!value || !startDate || !startDate.isValid() || !value.isValid()) {
                          return Promise.reject(new Error('Please select valid dates'));
                        }

                        if (startDate.isAfter(value)) {
                          return Promise.reject(new Error('End date must be after start date'));
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                  valuePropName="date"
                >
                  <DatePicker onChange={(date) => this.selectedEndDate(field.key, date)} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 0]}>
              <Col span={11}>
                <Form.Item label={L('DateOfWeek')}>
                  <Select
                    value={field.dateOfWeek.toString()}
                    onChange={(value) =>
                      this.handleDayOfWeekChange(field.key, value as unknown as DayOfTheWeek)}
                  >
                    {Object.entries(DayOfWeek).map(([day, dayOfWeek]) => (
                      <Select.Option key={day} value={day}>
                        {dayOfWeek}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label={L('ShiftTime')}>
                  <Select
                    value={field.shiftTime.toString()}
                    onChange={(value) =>
                      this.handleShiftChange(field.key, value as unknown as Shift)
                    }
                  >
                    {Object.entries(shiftNames).map(([shift, shiftName]) => (
                      <Select.Option key={shift} value={shift}>
                        {shiftName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}>
                {fields.length > 1 && (
                  <Button
                    type="primary"
                    danger
                    ghost
                    shape="circle"
                    icon={<MinusOutlined />}
                    onClick={() => this.handleRemoveField(field.key)}
                  />
                )}
              </Col>
            </Row>
          </Form.Item>
        ))}
      </>
    );
  }
}

export default DynamicFieldSet;
