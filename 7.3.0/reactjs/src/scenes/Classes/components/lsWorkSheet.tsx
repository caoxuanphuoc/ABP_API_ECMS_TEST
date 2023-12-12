import React from 'react';
import { Button, Card, Col, Form, Row, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { WorkShiftDto } from '../../../services/schedule/dto/workShiftDto';
import {DayOfWeek, DayOfTheWeek} from '../../../services/schedule/dto/dateOfTheWeek';
import { Shift, shiftNames } from '../../../services/schedule/dto/shift';
import { L } from '../../../lib/abpUtility';

interface DynamicFieldSetProps {
  onUpdateLsWorkSheet: (newLsWorkSheet: WorkShiftDto[]) => void;
}

interface DynamicFieldSetState {
  fields: { key: string; dateOfWeek: DayOfTheWeek; shiftTime: Shift }[];
}

class DynamicFieldSet extends React.Component<DynamicFieldSetProps, DynamicFieldSetState> {
  constructor(props: DynamicFieldSetProps) {
    super(props);
    const fields = [{ key: '', dateOfWeek: DayOfTheWeek.Monday, shiftTime: Shift.Tiet_1_2 }];
    this.state = {
      fields,
    };
  }

  handleAddField = () => {
    const { fields } = this.state;

    const newKey = Math.random().toString(36).substring(2);
    const newFields = [
      ...fields,
      { key: newKey, dateOfWeek: DayOfTheWeek.Monday, shiftTime: Shift.Tiet_1_2 },
    ];
    this.setState({ fields: newFields }, this.updateFormattedLsWorkSheet);
  };

  handleRemoveField = (keyToRemove: string) => {
    const { fields } = this.state;
    const newFields = fields.filter((field) => field.key !== keyToRemove);
    this.setState({ fields: newFields }, this.updateFormattedLsWorkSheet);
  };

  handleDayOfWeekChange = (key: string, dateOfWeek: DayOfTheWeek) => {
    this.updateField(key, { dateOfWeek });
  };

  handleShiftChange = (key: string, shiftTime: Shift) => {
    this.updateField(key, { shiftTime });
  };

  updateField = (
    key: string,
    updatedValues: Partial<{ dateOfWeek: DayOfTheWeek; shiftTime: Shift }>
  ) => {
    const { fields } = this.state;
    const newFields = fields.map((field) =>
      field.key === key ? { ...field, ...updatedValues } : field
    );
    this.setState({ fields: newFields }, this.updateFormattedLsWorkSheet);
  };

  updateFormattedLsWorkSheet = () => {
    const { fields } = this.state;
    const { onUpdateLsWorkSheet } = this.props;
    const formattedListWorkSheets = fields.map(({ dateOfWeek, shiftTime }) => ({
      dateOfWeek,
      shiftTime,
    }));
    onUpdateLsWorkSheet(formattedListWorkSheets);
  };

  render() {
    const { fields } = this.state;

    return (
      <Card
        bordered
        title="List WorkSheets"
        extra={(
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={this.handleAddField}
          />
        )}
      >
        {fields.map((field) => (
          <Form.Item key={field.key} name={['lsWorkSheet']}>
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
                      this.handleShiftChange(field.key, value as unknown as Shift)}
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
      </Card>
    );
  }
}

export default DynamicFieldSet;
