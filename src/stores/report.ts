// stores/fingerprint.js
import { defineStore } from "pinia";

export const useFingerprintStore = defineStore("fingerprint", {
  state: () => ({
    cards: [],
    filteredCards: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalCards: (state) => state.cards.length,

    cardsByPersonId: (state) => (personId) => {
      return state.cards.filter((card) => card.personId === personId);
    },

    completedCards: (state) => {
      return state.cards.filter((card) => {
        const fingerprintCount = card.fingerprints
          ? Object.keys(card.fingerprints).length
          : 0;
        return fingerprintCount === 10;
      });
    },
  },

  actions: {
    async fetchCards() {
      this.loading = true;
      try {
        // Simulate API call
        const response = await fetch("/api/fingerprint-cards");
        if (!response.ok) throw new Error("Failed to fetch fingerprint cards");

        const data = await response.json();
        this.cards = data;
        this.filteredCards = data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
        // Use sample data for development
        this.loadSampleData();
      } finally {
        this.loading = false;
      }
    },

    async searchCards(searchForm) {
      this.loading = true;
      try {
        const filtered = this.cards.filter((card) => {
          const matchCode =
            !searchForm.detaineeCode ||
            card.personId
              .toLowerCase()
              .includes(searchForm.detaineeCode.toLowerCase());
          const matchName =
            !searchForm.detaineeName ||
            (card.detaineeName &&
              card.detaineeName
                .toLowerCase()
                .includes(searchForm.detaineeName.toLowerCase()));

          return matchCode && matchName;
        });

        this.filteredCards = filtered;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createCard(cardData) {
      this.loading = true;
      try {
        // Simulate API call
        const response = await fetch("/api/fingerprint-cards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cardData),
        });

        if (!response.ok) throw new Error("Failed to create fingerprint card");

        const newCard = await response.json();

        // Add to local state
        newCard.id = this.cards.length + 1;
        newCard.createdAt = new Date().toISOString();
        this.cards.unshift(newCard);
        this.filteredCards = [...this.cards];

        return newCard;
      } catch (error) {
        // Simulate success for development
        const newCard = {
          id: this.cards.length + 1,
          ...cardData,
          createdAt: new Date().toISOString(),
        };

        this.cards.unshift(newCard);
        this.filteredCards = [...this.cards];

        return newCard;
      } finally {
        this.loading = false;
      }
    },

    async updateCard(id, updates) {
      this.loading = true;
      try {
        const response = await fetch(`/api/fingerprint-cards/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error("Failed to update fingerprint card");

        const updatedCard = await response.json();

        const index = this.cards.findIndex((card) => card.id === id);
        if (index !== -1) {
          this.cards[index] = updatedCard;
          this.filteredCards = [...this.cards];
        }

        return updatedCard;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCard(id) {
      this.loading = true;
      try {
        const response = await fetch(`/api/fingerprint-cards/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete fingerprint card");

        this.cards = this.cards.filter((card) => card.id !== id);
        this.filteredCards = this.filteredCards.filter(
          (card) => card.id !== id
        );
      } catch (error) {
        // Simulate success for development
        this.cards = this.cards.filter((card) => card.id !== id);
        this.filteredCards = this.filteredCards.filter(
          (card) => card.id !== id
        );
      } finally {
        this.loading = false;
      }
    },

    loadSampleData() {
      this.cards = [
        {
          id: 1,
          personId: "PN001",
          detaineeName: "Nguyễn Văn A",
          createdDate: "2024-01-15",
          createdPlace: "Trại giam T16",
          fpFormula: "AL-32-W-OOO",
          dp: "15",
          tw: "8",
          reasonNote: "Lập chỉ bản phục vụ điều tra",
          fingerprints: {
            RIGHT_THUMB: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_INDEX: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_MIDDLE: { preview: "/placeholder-fingerprint.jpg" },
          },
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          personId: "PN002",
          detaineeName: "Trần Thị B",
          createdDate: "2024-02-20",
          createdPlace: "Trại giam T16",
          fpFormula: "WL-28-A-IOI",
          dp: "12",
          tw: "6",
          reasonNote: "Lập chỉ bản theo quy định",
          fingerprints: {
            RIGHT_THUMB: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_INDEX: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_MIDDLE: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_RING: { preview: "/placeholder-fingerprint.jpg" },
            RIGHT_LITTLE: { preview: "/placeholder-fingerprint.jpg" },
            LEFT_THUMB: { preview: "/placeholder-fingerprint.jpg" },
            LEFT_INDEX: { preview: "/placeholder-fingerprint.jpg" },
            LEFT_MIDDLE: { preview: "/placeholder-fingerprint.jpg" },
            LEFT_RING: { preview: "/placeholder-fingerprint.jpg" },
            LEFT_LITTLE: { preview: "/placeholder-fingerprint.jpg" },
          },
          createdAt: "2024-02-20T14:15:00Z",
        },
      ];
      this.filteredCards = [...this.cards];
    },
  },
});

// stores/report.js
import { defineStore } from "pinia";

export const useReportStore = defineStore("report", {
  state: () => ({
    reports: [],
    loading: false,
    error: null,
  }),

  getters: {
    reportsByType: (state) => (type) => {
      return state.reports.filter((report) => report.type === type);
    },
  },

  actions: {
    async getOverviewStatistics() {
      try {
        // Simulate API call
        const response = await fetch("/api/statistics/overview");

        if (response.ok) {
          return await response.json();
        }

        // Return sample data for development
        return {
          totalDetainees: 127,
          totalStaff: 48,
          totalIdentity: 98,
          totalFingerprint: 85,
          detaineeChange: 5,
          staffChange: -2,
          identityChange: 12,
          fingerprintChange: 8,
        };
      } catch (error) {
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
        // Simulate API call
        const response = await fetch("/api/reports/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type, fromDate, toDate }),
        });

        if (response.ok) {
          return await response.json();
        }

        // Generate sample report data
        return this.generateSampleReport(type, fromDate, toDate);
      } catch (error) {
        this.error = error.message;
        return this.generateSampleReport(type, fromDate, toDate);
      } finally {
        this.loading = false;
      }
    },

    generateSampleReport(type, fromDate, toDate) {
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

    async exportToExcel(data) {
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

    async exportToPDF(reportData) {
      // Simulate PDF export
      console.log("Exporting to PDF:", reportData);

      // In real implementation, use libraries like jsPDF or Puppeteer
      const printContent = this.generatePrintHTML(reportData);

      const printWindow = window.open("", "_blank");
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      // Auto print and close after delay
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    },

    convertToCSV(data) {
      const headers = data.columns.map((col) => col.title).join(",");
      const rows = data.data
        .map((row) => data.columns.map((col) => row[col.key] || "").join(","))
        .join("\n");

      return `${headers}\n${rows}`;
    },

    generatePrintHTML(reportData) {
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
                  .map((col) => `<th>${col.title}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${reportData.data
                .map(
                  (row) =>
                    `<tr>${reportData.columns
                      .map(
                        (col) =>
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
                  (insight) => `
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

    formatValue(value, type) {
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

// stores/detainee.js (Referenced in fingerprint store)
import { defineStore } from "pinia";

export const useDetaineeStore = defineStore("detainee", {
  state: () => ({
    detainees: [],
    loading: false,
    error: null,
  }),

  actions: {
    async findByCode(code) {
      // Simulate API call or search in local data
      const detainee = this.detainees.find((d) => d.detainee_code === code);

      if (detainee) {
        return detainee;
      }

      // Return sample data for development
      const sampleDetainees = {
        PN001: { fullName: "Nguyễn Văn A", detainee_code: "PN001" },
        PN002: { fullName: "Trần Thị B", detainee_code: "PN002" },
        PN003: { fullName: "Lê Văn C", detainee_code: "PN003" },
      };

      return sampleDetainees[code] || null;
    },
  },
});

// stores/staff.js (Referenced in report store)
import { defineStore } from "pinia";

export const useStaffStore = defineStore("staff", {
  state: () => ({
    staff: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalStaff: (state) => state.staff.length,
    activeStaff: (state) =>
      state.staff.filter((s) => s.status === "ACTIVE").length,
  },
});

// stores/identity.js (Referenced in report store)
import { defineStore } from "pinia";

export const useIdentityStore = defineStore("identity", {
  state: () => ({
    records: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalRecords: (state) => state.records.length,
  },
});
