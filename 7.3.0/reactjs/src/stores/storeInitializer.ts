import RoleStore from './roleStore';
import TenantStore from './tenantStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import WorkShiftStore from './workShiftStore';
import CourseStore from './courseStore';
import ClassStore from './classStore';
import PositionStore from './positionStore';
import ScheduleStore from './scheduleStore';

export default function initializeStores() {
  return {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    tenantStore: new TenantStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    accountStore: new AccountStore(),
    workShiftStore: new WorkShiftStore(),
    courseStore: new CourseStore(),
    classStore: new ClassStore(),
    positionStore: new PositionStore(),
    scheduleStore: new ScheduleStore(),
  };
}
