import { Card } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { FormInstance } from 'antd/lib/form';
import UserClassStore from '../../stores/userClassStore';
import AppComponentBase from '../../components/AppComponentBase';
import Stores from '../../stores/storeIdentifier';
import UserClassData from './components/userClassData';

export interface IUserClassProps {
  userClassStore: UserClassStore;
}

export interface IUserClassState {
  isActive: boolean;
  activeTabKey: string;
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userClassId: number;
  filter: string;
}

@inject(Stores.UserClassStore)
@observer
class UserClass extends AppComponentBase<IUserClassProps, IUserClassState> {
  formRef = React.createRef<FormInstance>();

  state = {
    isActive: true,
    activeTabKey: 'DaDuyet',
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userClassId: 0,
    filter: '',
  };

  public render() {
    const tabList = [
      {
        key: 'DaDuyet',
        tab: 'Đã duyệt',
        content: <UserClassData isActive userClassStore={this.props.userClassStore} />,
      },
      {
        key: 'ChoDuyet',
        tab: 'Chờ duyệt',
        content: <UserClassData isActive={false} userClassStore={this.props.userClassStore} />,
      },
    ];

    const onTabChange = (key: string) => {
      this.setState({
        activeTabKey: key,
      });
    };

    return (
      <Card
        style={{ width: '100%' }}
        tabList={tabList}
        activeTabKey={this.state.activeTabKey}
        onTabChange={(key) => onTabChange(key)}
      >
        {tabList.map(
          (tab) =>
            tab.key === this.state.activeTabKey && (
              <React.Fragment key={tab.key}>{tab.content}</React.Fragment>
            )
        )}
      </Card>
    );
  }
}

export default UserClass;
