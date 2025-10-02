import type { Staff } from "@/i18n/type";

const staff: Staff = {
  // Sections
  basicInfo: "Basic Information",
  contactInfo: "Contact Information",
  permanentAddressSection: "Permanent Address",
  temporaryAddressSection: "Temporary Address",
  jobInfo: "Job Information",
  text: "Staff",

  // Form Labels
  profileNumber: "Profile Number",
  code: "Staff Code",
  fullName: "Full Name",
  gender: "Gender",
  male: "Male",
  female: "Female",
  dateOfBirth: "Date of Birth",
  placeOfBirth: "Place of Birth",
  ethnicity: "Ethnicity",
  religion: "Religion",
  idNumber: "ID/Passport Number",
  idIssueDate: "Issue Date",
  idIssuePlace: "Place of Issue",
  phone: "Phone Number",
  email: "Email",
  emergencyContact: "Emergency Contact",
  emergencyPhone: "Emergency Phone",
  province: "Province/City",
  ward: "Ward/Commune",
  address: "Address",
  detailAddress: "House number, street, hamlet...",
  rank: "Rank",
  department: "Department",
  position: "Position",
  prison: "Prison",
  educationLevel: "Education Level",
  status: "Status",
  isActive: "Active",
  active: "Active",
  inactive: "Inactive",
  detentionCenter: "Working Prison",
  education: "Education",

  // Buttons
  addNew: "Add New Staff",
  submit: "Save",
  reset: "Reset",
  cancel: "Cancel",
  update: "Update",

  // Titles / Dialogs
  detailTitle: "Staff Details",

  // Placeholders
  placeholder: {
    code: "Enter staff code...",
    fullName: "Enter full name...",
    rank: "Enter rank...",
    phone: "Enter phone number...",
    email: "Enter email...",
    emergencyContact: "Enter emergency contact...",
    emergencyPhone: "Enter emergency phone...",
    dateOfBirth: "Select date of birth...",
    idIssueDate: "Select issue date...",
    createdPlace: "Enter place of birth...",
    province: "Select province/city...",
    ward: "Select ward/commune...",
  },

  // Validation Messages
  validation: {
    required: {
      code: "Please enter staff code",
      fullName: "Please enter full name",
      gender: "Please select gender",
      phone: "Please enter phone number",
      rank: "Please enter rank",
      detentionCenter: "Please select a prison",
      status: "Please select status",
    },
    pattern: {
      phone: "Invalid phone number",
      email: "Invalid email address",
    },
    length: {
      code: "Staff code must be 3–20 characters",
      fullName: "Full name must be 2–50 characters",
    },
  },
};

export default staff;
