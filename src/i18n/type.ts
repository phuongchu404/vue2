export interface Common {
  id: string;
  index: string;
  option: string;
  authorize: string;
  authentication: string;
  cancel: string;
  reset: string;
  export: string;
  ok: string;
  createTime: string;
  updateTime: string;
  createUser: string;
  addCard: string;
  updateUser: string;
  information: string;
  loadFail: string;
  deleteConfirm: string;
  lostConfirm: string;
  confirm: string;
  deleteFail: string;
  deleteOneConfirm: string;
  lostFail: string;
  "data-file": string;
  deleteSuccess: string;
  insertFail: string;
  "select-all": string;
  "select-none": string;
  insertSuccess: string;
  updateFail: string;
  updateSuccess: string;
  time: string;
  yes: string;
  no: string;
  all: string;
  idcardNo: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  male: string;
  female: string;
  unspecified: string;
  actions: string;
  image: string;
  fingerprint: string;
  face: string;
  "id-card": string;
  "session-expired-message": string;
  camera: string;
  "loading.text.processing": string;
  total: string;
  classification: string;
  unit: string;
  add: string;
  status: string;
  close: string;
  provider: string;
  from: string;
  to: string;
  detail: string;
  title: string;
  "upload-success-message": string;
  inputFile: string;
  inputStatus: string;
  Search: string;
  create: string;
  edit: string;
  update: string;
  exportUpdating: string;
}

export interface Home {
  funPassword: string;
  funLogout: string;
  userInfo: string;
  passwordOld: string;
  passwordNew: string;
  passwordRepeat: string;
  oldIsNull: string;
  newIsNull: string;
  repeatNew: string;
  notSame: string;
  isSame: string;
  passwordSuccess: string;
  passwordFail: string;
  logoutMessage: string;
  confirmTip: string;
  title: string;
  authentication: string;
  changePasswordConfirm: string;
}

export interface Login {
  userId: string;
  password: string;
  otp: string;
  login: string;
  userIsNull: string;
  passwordIsNull: string;
  OTPtip: string;
  loginFailed: string;
  message: string;
}

export interface Identity {
  // Titles
  createTitle: string;
  editTitle: string;
  infoSection: string;
  photoSection: string;
  anthropometry: string;

  // Search Section
  detaineeId: string;
  detaineeName: string;
  arrestUnit: string;

  placeholder: {
    detaineeId: string;
    detaineeName: string;
    arrestUnit: string;
    createdPlace: string;
    arrestDate: string;
    fpClassification: string;
    dp: string;
    tw: string;
    akFileNo: string;
    notes: string;
    reasonNote: string;
    faceShape: string;
    noseBridge: string;
    earLowerFold: string;
    earLobe: string;
    distinctiveMarks: string;
  };

  // Form Labels
  createdPlace: string;
  arrestDate: string;
  fpClassification: string;
  dp: string;
  tw: string;
  akFileNo: string;
  notes: string;
  reasonNote: string;
  faceShape: string;
  height: string;
  noseBridge: string;
  earLowerFold: string;
  earLobe: string;
  distinctiveMarks: string;
  photoFront: string;
  photoLeft: string;
  photoRight: string;

  // Data Table
  id: string;
  arrestDateTable: string;
  fpClassificationTable: string;
  photoTable: string;

  // Detail Dialog
  detailTitle: string;
  noPhoto: string;
}

export interface Menu {
  index: string;
  system: string;
  user: string;
  role: string;
  prison: string;
  detainee: string;
  staff: string;
  identity: string;
  fingerprint: string;
  report: string;
}

export interface Option {
  add: string;
  update: string;
  delete: string;
  query: string;
  page: string;
  resetPassword: string;
  account: string;
  assignRole: string;
  assignPermission: string;
  import: string;
  syn: string;
  detail: string;
}

export interface Permission {
  menus: string;
  options: string;
  description: string;
  url: string;
}

export interface Prison {
  // Titles
  editTitle: string;
  detailTitle: string;

  // Labels
  code: string;
  name: string;
  phone: string;
  province: string;
  ward: string;
  address: string;
  director: string;
  deputyDirector: string;
  capacity: string;
  currentPopulation: string;
  status: string;
  active: string;
  inactive: string;
  occupancyRate: string;
  people: string;
  unit: string;

  // Placeholders
  placeholder: {
    code: string;
    name: string;
    phone: string;
    province: string;
    ward: string;
    address: string;
    director: string;
    deputyDirector: string;
    capacity: string;
    currentPopulation: string;
    description: string;
    status: string;
  };
}

export interface Profile {
  infotitle: string;
  username: string;
  realname: string;
  roles: string;
  lastlogin: string;
  twostepstatus: string;
  twosteptitle: string;
  tiprow1: string;
  tiprow2: string;
  otp: string;
  otpisnull: string;
  activatetip: string;
  confirmactivatetip: string;
  activatefaliedtip: string;
  activatefalieddetailtip: string;
  activatesuccesstip: string;
}

export interface Role {
  roleName: string;
  description: string;
  add: string;
  update: string;
  syncPermission: string;
  detailedInformation: string;
  inputRoleName: string;
  inputDescription: string;
  selectRolePermission: string;
}

export interface Route {
  home: string;
  dashboard: string;
  users: string;
  roles: string;
  detainees: string;
  reports: string;
  detaineeList: string;
  detaineeAdd: string;
  detaineeEdit: string;
  prisonList: string;
  prisonAdd: string;
  prisonEdit: string;
  staffList: string;
  staffAdd: string;
  staffEdit: string;
  fingerprint: string;
  identityList: string;
  identityAdd: string;
  identityEdit: string;
}

export interface Staff {
  // Sections
  basicInfo: string;
  contactInfo: string;
  permanentAddressSection: string;
  temporaryAddressSection: string;
  jobInfo: string;

  // Form Labels
  profileNumber: string;
  code: string;
  fullName: string;
  gender: string;
  male: string;
  female: string;
  dateOfBirth: string;
  placeOfBirth: string;
  ethnicity: string;
  religion: string;
  idNumber: string;
  idIssueDate: string;
  idIssuePlace: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  province: string;
  ward: string;
  address: string;
  detailAddress: string;
  rank: string;
  department: string;
  position: string;
  prison: string;
  educationLevel: string;
  status: string;
  isActive: string;
  active: string;
  inactive: string;
  detentionCenter: string;
  education: string;

  // Buttons
  addNew: string;
  submit: string;
  reset: string;
  cancel: string;
  update: string;

  // Titles / Dialogs
  detailTitle: string;

  // Placeholders
  placeholder: {
    code: string;
    fullName: string;
    rank: string;
    phone: string;
    email: string;
    emergencyContact: string;
    emergencyPhone: string;
    dateOfBirth: string;
    idIssueDate: string;
    createdPlace: string;
    province: string;
    ward: string;
  };

  // Validation
  validation: {
    required: {
      code: string;
      fullName: string;
      gender: string;
      phone: string;
      rank: string;
      detentionCenter: string;
      status: string;
    };
    pattern: {
      phone: string;
      email: string;
    };
    length: {
      code: string;
      fullName: string;
    };
  };
}

export interface User {
  userName: string;
  roles: string;
  allocateRole: string;
  resetPassword: string;
  realName: string;
  selectRole: string;
  add: string;
  update: string;
  inputUserName: string;
  inputRealName: string;
  inputProvider: string;
  resetPasswordConfirm: string;
  resetPasswordSuccess: string;
  resetPasswordFail: string;
  provider: string;
  incorrectpassword: string;
  password: string;
  ResetPassword: string;
}
