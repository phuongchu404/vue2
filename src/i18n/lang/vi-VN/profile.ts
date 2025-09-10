import type { Profile } from "@/i18n/type";

const profile: Profile = {
  infotitle: "Thông tin người dùng",
  username: "Tên đăng nhập",
  realname: "Tên người dùng",
  roles: "Vai trò",
  lastlogin: "Lần đăng nhập gần nhất",
  twostepstatus: "Xác thực 2 bước",
  twosteptitle: "Kích hoạt xác thực 2 bước",
  tiprow1: "Sử dụng Authy quét mã để kích hoạt",
  tiprow2: "Authy sẽ trả về một mã OTP, hãy điền vào đây: ",
  otp: "Mã OTP: ",
  otpisnull: "Hãy điền OTP",
  activatetip: "Chưa kích hoạt xác thực 2 lần!",
  confirmactivatetip:
    "Nếu trước đây đã kích hoạt tính năng này thì lần kích hoạt mới này sẽ vô hiệu hoá tài khoản Authy cũ! Xác nhận kích hoạt lại?",
  activatefaliedtip: "Kích hoạt thất bại!",
  activatefalieddetailtip: "Kích hoạt thất bại! Nguyên nhân: ",
  activatesuccesstip: "Kích hoạt thành công!",
};

export default profile;
