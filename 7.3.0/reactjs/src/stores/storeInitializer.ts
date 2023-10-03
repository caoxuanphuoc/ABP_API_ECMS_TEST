import RoleStore from './roleStore';
import TenantStore from './tenantStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import WorkShiftStore from './workShiftStore';
import CourseStore from './courseStore';
import ClassStore from './classStore';
import ScheduleStore from './scheduleStore';
import TeacherStore from './teacherStore';

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
    scheduleStore: new ScheduleStore(),
    teacherStore: new TeacherStore(),
  };
}
