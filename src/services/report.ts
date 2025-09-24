import * as Utils from "../utils";
import type { ReportDetaineeByStatus } from "../types/report";
export const ReportService = {
  async overview() {
    const res = Utils.doGet(`/api/admin/report/statistics/overview`);
    return res;
  },
  async detaineeByStatus(params: ReportDetaineeByStatus) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(
      `/api/admin/report/reports/detainees-by-status?${param}`
    );
    return res;
  },

  async detaineeByMonth(params: ReportDetaineeByStatus) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(
      `/api/admin/report/reports/monthly-trends?${param}`
    );
    return res;
  },

  async staffByDepartment() {
    const res = Utils.doGet(`/api/admin/report/reports/staff-by-department`);
    return res;
  },
  async identityRecords(params: ReportDetaineeByStatus) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(
      `/api/admin/report/reports/identity-records?${param}`
    );
    return res;
  },
  async fingerprintCards(params: ReportDetaineeByStatus) {
    let param = Utils.queryFormWrapper(params);
    const res = Utils.doGet(
      `/api/admin/report/reports/fingerprint-cards?${param}`
    );
    return res;
  },
};
