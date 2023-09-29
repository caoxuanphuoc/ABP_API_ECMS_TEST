import { FormInstance } from 'antd/lib/form';
import React from 'react';
import WorkShiftStore from '../../../../stores/workShiftStore';

export interface ICreateOrUpdateScheduleProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  formRef: React.RefObject<FormInstance>;
  workShiftStore: WorkShiftStore;
}

export interface ICreateOrUpdateScheduleState {
  maxResultCount: number;
}

class CreateOrUpdateSchedule extends React.Component<ICreateOrUpdateScheduleProps, ICreateOrUpdateScheduleState> {
    
}
