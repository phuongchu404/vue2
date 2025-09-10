import type { Profile } from "@/i18n/type";

const profile: Profile = {
  infotitle: "User Information",
  username: "Username",
  realname: "Full Name",
  roles: "Roles",
  lastlogin: "Last Login",
  twostepstatus: "Two-Step Verification",
  twosteptitle: "Enable Two-Step Verification",
  tiprow1: "Use Authy to scan the QR code to activate",
  tiprow2: "Authy will return an OTP code, please enter it here: ",
  otp: "OTP Code: ",
  otpisnull: "Please enter the OTP",
  activatetip: "Two-step verification has not been activated!",
  confirmactivatetip:
    "If you have previously activated this feature, this new activation will deactivate your old Authy account! Do you want to activate again?",
  activatefaliedtip: "Activation failed!",
  activatefalieddetailtip: "Activation failed! Reason: ",
  activatesuccesstip: "Activation successful!",
};

export default profile;
