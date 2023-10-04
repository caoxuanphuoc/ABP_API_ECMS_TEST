import { Card } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { FormInstance } from 'antd/lib/form';
import UserClassStore from '../../stores/userClassStore';
import AppComponentBase from '../../components/AppComponentBase';
import Stores from '../../stores/storeIdentifier';
import UserClassData from './components/userClassData';
import UserStore from '../../stores/userStore';
import ClassStore from '../../stores/classStore';

export interface IUserClassProps {
  userClassStore: UserClassStore;
  userStore: UserStore;
  classStore: ClassStore;
}

export interface IUserClassState {
  isActive: boolean;
  activeTabKey: string;
}

@inject(Stores.UserClassStore, Stores.UserStore, Stores.ClassStore)
@observer
class UserClass extends AppComponentBase<IUserClassProps, IUserClassState> {
  formRef = React.createRef<FormInstance>();

  state = {
    isActive: true,
    activeTabKey: 'DaDuyet',
  };

  public render() {
    const { userClasses } = this.props.userClassStore;
    const tabList = [
      {
        key: 'DaDuyet',
        tab: 'Đã duyệt',
        content: (
          <UserClassData
            isActive
            userClassStore={this.props.userClassStore}
            userClasses={userClasses}
            userStore={this.props.userStore}
            classStore={this.props.classStore}
          />
        ),
      },
      {
        key: 'ChoDuyet',
        tab: 'Chờ duyệt',
        content: (
          <UserClassData
            isActive={false}
            userClassStore={this.props.userClassStore}
            userClasses={userClasses}
            userStore={this.props.userStore}
            classStore={this.props.classStore}
          />
        ),
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
