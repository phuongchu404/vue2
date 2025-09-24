import { defineStore } from "pinia";
import { ReportService } from "@/services/report";

export const useReportStore = defineStore("report", {
  state: () => ({
    reports: [],
    loading: false,
    error: null,
  }),

  getters: {
    reportsByType: (state) => (type: any) => {
      return state.reports.filter((report: any) => report.type === type);
    },
  },

  actions: {
    async getOverviewStatistics() {
      try {
        // Simulate API call
        const response = await ReportService.overview();
        return await response;
      } catch (error: any) {
        this.error = error.message;
        return {
          totalDetainees: 0,
          totalStaff: 0,
          totalIdentity: 0,
          totalFingerprint: 0,
          detaineeChange: 0,
          staffChange: 0,
          identityChange: 0,
          fingerprintChange: 0,
        };
      }
    },

    async generateReport({ type, fromDate, toDate }) {
      this.loading = true;
      try {
        switch (type) {
          case "detainees-by-status":
            const response = await ReportService.detaineeByStatus({
              fromDate,
              toDate,
            });
            return await response;
          case "detainees-by-month":
            const response2 = await ReportService.detaineeByMonth({
              fromDate,
              toDate,
            });
            return await response2;
          case "staff-by-department":
            const response3 = await ReportService.staffByDepartment();
            return await response3;
          case "identity-records":
            const response4 = await ReportService.identityRecords({
              fromDate,
              toDate,
            });
            return await response4;
          case "fingerprint-cards":
            const response5 = await ReportService.fingerprintCards({
              fromDate,
              toDate,
            });
            return await response5;
          default:
            break;
        }
      } catch (error: any) {
        this.error = error.message;
        return this.generateSampleReport(type, fromDate, toDate);
      } finally {
        this.loading = false;
      }
    },

    generateSampleReport(type: any, fromDate: any, toDate: any) {
      const reports = {
        "detainees-by-status": {
          title: "Báo Cáo Phạm Nhân Theo Trạng Thái",
          columns: [
            { key: "status", title: "Trạng Thái", type: "text" },
            { key: "count", title: "Số Lượng", type: "number" },
            { key: "percentage", title: "Tỷ Lệ (%)", type: "number" },
          ],
          data: [
            { status: "Đang giam giữ", count: 98, percentage: 77.2 },
            { status: "Đã thả", count: 25, percentage: 19.7 },
            { status: "Chuyển trại", count: 4, percentage: 3.1 },
          ],
          summary: {
            status: "Tổng cộng",
            count: 127,
            percentage: 100,
          },
          chartData: {
            type: "pie",
            data: {
              labels: ["Đang giam giữ", "Đã thả", "Chuyển trại"],
              datasets: [
                {
                  data: [98, 25, 4],
                  backgroundColor: ["#667eea", "#51cf66", "#ff6b6b"],
                },
              ],
            },
          },
          insights: [
            {
              title: "Tỷ lệ giam giữ",
              description: "Hiện tại có 77.2% phạm nhân đang bị giam giữ",
              value: "98/127 người",
            },
            {
              title: "Xu hướng",
              description: "Số lượng phạm nhân tăng 5 người so với tháng trước",
            },
          ],
        },

        "detainees-by-month": {
          title: "Báo Cáo Phạm Nhân Theo Tháng",
          columns: [
            { key: "month", title: "Tháng", type: "text" },
            { key: "newDetainees", title: "Phạm nhân mới", type: "number" },
            { key: "released", title: "Đã thả", type: "number" },
            { key: "total", title: "Tổng cuối tháng", type: "number" },
          ],
          data: [
            { month: "2024-01", newDetainees: 15, released: 8, total: 105 },
            { month: "2024-02", newDetainees: 12, released: 6, total: 111 },
            { month: "2024-03", newDetainees: 18, released: 10, total: 119 },
            { month: "2024-04", newDetainees: 14, released: 6, total: 127 },
          ],
          chartData: {
            type: "line",
            data: {
              labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
              datasets: [
                {
                  label: "Phạm nhân mới",
                  data: [15, 12, 18, 14],
                  borderColor: "#667eea",
                },
                {
                  label: "Đã thả",
                  data: [8, 6, 10, 6],
                  borderColor: "#51cf66",
                },
              ],
            },
          },
          insights: [
            {
              title: "Tháng cao nhất",
              description: "Tháng 3 có số phạm nhân mới cao nhất",
              value: "18 người",
            },
          ],
        },

        "staff-by-department": {
          title: "Báo Cáo Cán Bộ Theo Phòng Ban",
          columns: [
            { key: "department", title: "Phòng Ban", type: "text" },
            { key: "count", title: "Số Lượng", type: "number" },
            { key: "active", title: "Đang làm việc", type: "number" },
          ],
          data: [
            { department: "Phòng An ninh", count: 18, active: 16 },
            { department: "Phòng Giáo dục", count: 12, active: 11 },
            { department: "Phòng Y tế", count: 8, active: 8 },
            { department: "Phòng Hậu cần", count: 10, active: 9 },
          ],
          insights: [
            {
              title: "Phòng ban lớn nhất",
              description: "Phòng An ninh có số cán bộ đông nhất",
              value: "18 người",
            },
          ],
        },

        "identity-records": {
          title: "Báo Cáo Danh Bản Đã Lập",
          columns: [
            { key: "id", title: "ID", type: "number" },
            { key: "detaineeId", title: "Mã phạm nhân", type: "text" },
            { key: "detaineeName", title: "Tên phạm nhân", type: "text" },
            { key: "createdDate", title: "Ngày tạo", type: "date" },
          ],
          data: [
            {
              id: 1,
              detaineeId: "PN001",
              detaineeName: "Nguyễn Văn A",
              createdDate: "2024-01-15",
            },
            {
              id: 2,
              detaineeId: "PN002",
              detaineeName: "Trần Thị B",
              createdDate: "2024-02-20",
            },
            {
              id: 3,
              detaineeId: "PN003",
              detaineeName: "Lê Văn C",
              createdDate: "2024-03-10",
            },
          ],
        },

        "fingerprint-cards": {
          title: "Báo Cáo Chỉ Bản Đã Lập",
          columns: [
            { key: "id", title: "ID", type: "number" },
            { key: "personId", title: "Mã phạm nhân", type: "text" },
            { key: "detaineeName", title: "Tên phạm nhân", type: "text" },
            { key: "createdDate", title: "Ngày tạo", type: "date" },
            { key: "completeness", title: "Độ hoàn thiện", type: "text" },
          ],
          data: [
            {
              id: 1,
              personId: "PN001",
              detaineeName: "Nguyễn Văn A",
              createdDate: "2024-01-15",
              completeness: "3/10",
            },
            {
              id: 2,
              personId: "PN002",
              detaineeName: "Trần Thị B",
              createdDate: "2024-02-20",
              completeness: "10/10",
            },
          ],
        },

        "monthly-summary": {
          title: "Báo Cáo Tổng Hợp Theo Tháng",
          columns: [
            { key: "metric", title: "Chỉ số", type: "text" },
            { key: "value", title: "Giá trị", type: "number" },
            { key: "change", title: "Thay đổi", type: "text" },
          ],
          data: [
            { metric: "Phạm nhân mới", value: 14, change: "+2" },
            { metric: "Phạm nhân thả", value: 6, change: "-4" },
            { metric: "Danh bản lập mới", value: 12, change: "+8" },
            { metric: "Chỉ bản lập mới", value: 8, change: "+3" },
          ],
        },
      };

      return (
        reports[type] || {
          title: "Báo cáo không xác định",
          columns: [],
          data: [],
        }
      );
    },

    async exportToExcel(data: any) {
      // Simulate Excel export
      console.log("Exporting to Excel:", data);

      // In real implementation, use libraries like xlsx or exceljs
      const csvContent = this.convertToCSV(data);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = `${data.title}.csv`;
      link.click();

      URL.revokeObjectURL(link.href);
    },

    async exportToPDF(reportData: any) {
      // Simulate PDF export
      console.log("Exporting to PDF:", reportData);

      // In real implementation, use libraries like jsPDF or Puppeteer
      const printContent = this.generatePrintHTML(reportData);

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();

        // Auto print and close after delay
        setTimeout(() => {
          printWindow.print();
          // printWindow.close();
        }, 500);
      }
    },

    convertToCSV(data: any) {
      const headers = data.columns.map((col: any) => col.title).join(",");
      const rows = data.data
        .map((row: any) =>
          data.columns.map((col: any) => row[col.key] || "").join(",")
        )
        .join("\n");

      return `${headers}\n${rows}`;
    },

    generatePrintHTML(reportData: any) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${reportData.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2c3e50; text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #667eea; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .summary-row { font-weight: bold; background-color: #e8f4f8; }
            .report-meta { text-align: center; margin: 20px 0; color: #666; }
            .insights { margin-top: 30px; }
            .insight { margin: 15px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #667eea; }
          </style>
        </head>
        <body>
          <h1>${reportData.title}</h1>
          <div class="report-meta">
            Tạo lúc: ${new Date().toLocaleString("vi-VN")}
          </div>
          <table>
            <thead>
              <tr>
                ${reportData.columns
                  .map((col: any) => `<th>${col.title}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${reportData.data
                .map(
                  (row: any) =>
                    `<tr>${reportData.columns
                      .map(
                        (col: any) =>
                          `<td>${this.formatValue(row[col.key], col.type)}</td>`
                      )
                      .join("")}</tr>`
                )
                .join("")}
            </tbody>
          </table>
          ${
            reportData.insights
              ? `
            <div class="insights">
              <h3>Tóm tắt & Phân tích</h3>
              ${reportData.insights
                .map(
                  (insight: any) => `
                <div class="insight">
                  <h4>${insight.title}</h4>
                  <p>${insight.description}</p>
                  ${insight.value ? `<strong>${insight.value}</strong>` : ""}
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
        </body>
        </html>
      `;
    },

    formatValue(value: any, type: any) {
      if (value === null || value === undefined) return "-";

      switch (type) {
        case "date":
          return new Date(value).toLocaleDateString("vi-VN");
        case "number":
          return typeof value === "number"
            ? value.toLocaleString("vi-VN")
            : value;
        default:
          return value;
      }
    },
  },
});
