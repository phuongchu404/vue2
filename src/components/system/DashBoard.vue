<template>
  <div class="dashboard">
    <!-- Statistics Cards -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card prison-card">
          <div class="stats-content">
            <div class="stats-icon">
              <el-icon size="32"><OfficeBuilding /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ prisonStore.getTotal }}</div>
              <div class="stats-label">Trại giam</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card detainee-card">
          <div class="stats-content">
            <div class="stats-icon">
              <el-icon size="32"><User /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">
                {{ detaineeStore.getTotal }}
              </div>
              <div class="stats-label">Phạm nhân</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card staff-card">
          <div class="stats-content">
            <div class="stats-icon">
              <el-icon size="32"><Avatar /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">{{ staffStore.getTotal }}</div>
              <div class="stats-label">Cán bộ</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stats-card identity-card">
          <div class="stats-content">
            <div class="stats-icon">
              <el-icon size="32"><Document /></el-icon>
            </div>
            <div class="stats-info">
              <div class="stats-number">
                {{ identityStore.getTotal }}
              </div>
              <div class="stats-label">Danh bản</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Prison Overview -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>Tình hình các trại giam</span>
              <el-button type="primary" @click="$router.push('/prisons')">
                Xem tất cả
              </el-button>
            </div>
          </template>

          <el-table :data="prisonStore.prisons" style="width: 100%">
            <el-table-column prop="code" label="Mã trại giam" width="120" />
            <el-table-column prop="name" label="Tên trại giam" />
            <el-table-column prop="warden" label="Giám thị" />
            <el-table-column label="Sức chứa">
              <template #default="scope">
                {{ scope.row.currentPopulation }}/{{ scope.row.capacity }}
              </template>
            </el-table-column>
            <el-table-column :label="t('prison.occupancyRate')" width="150">
              <template #default="scope">
                <el-progress
                  :percentage="
                    Number(
                      (
                        (scope.row.currentPopulation / scope.row.capacity) *
                        100
                      ).toFixed(2)
                    )
                  "
                  :color="
                    getProgressColor(
                      scope.row.currentPopulation / scope.row.capacity
                    )
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="t('prison.status')"
              width="110"
              align="center"
            >
              <template #default="scope">
                <el-tag
                  :type="scope.row.isActive === true ? 'success' : 'danger'"
                >
                  {{
                    scope.row.isActive === true
                      ? t("prison.active")
                      : t("prison.inactive")
                  }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Activities -->
    <el-row :gutter="20" class="mt-4">
      <el-col :md="12" :span="24">
        <el-card>
          <template #header>
            <span>Phạm nhân mới nhập</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="detainee in detaineeStore.getDetainees"
              :key="detainee.id"
              :timestamp="formatDate(detainee.detentionDate)"
              placement="top"
            >
              <el-card>
                <h4>{{ detainee.fullName }}</h4>
                <p>Mã: {{ detainee.detaineeCode }}</p>
                <p>Tội danh: {{ detainee.charges }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <el-col :md="12" :span="24">
        <el-card>
          <template #header>
            <span>Cán bộ mới</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="member in staffStore.getStaffs"
              :key="member.id"
              :timestamp="formatDate(member.createdAt)"
              placement="top"
            >
              <el-card>
                <h4>{{ member.fullName }}</h4>
                <p>Mã: {{ member.staffCode }}</p>
                <p>Cấp bậc: {{ member.rank }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import {
  OfficeBuilding,
  User,
  Avatar,
  Document,
} from "@element-plus/icons-vue";
// import {
//   usePrisonStore,
//   useDetaineeStore,
//   useStaffStore,
//   useIdentityStore,
// } from "@/stores";
import { nextTick } from "vue";
import { usePrisonStore } from "@/stores/prison";
import { useDetaineeStore } from "@/stores/detainee";
import { useStaffStore } from "@/stores/staff";
import { useIdentityStore } from "@/stores/identity";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const prisonStore = usePrisonStore();
const detaineeStore = useDetaineeStore();
const staffStore = useStaffStore();
const identityStore = useIdentityStore();

onMounted(async () => {
  await nextTick();
  await prisonStore.getTop3Recent();
  await prisonStore.count();
  await detaineeStore.getTop3Recent();
  await detaineeStore.count();
  await staffStore.getTop3Recent();
  await staffStore.count();
  await identityStore.count();
});

// const recentDetainees = computed(() => {
//   return detaineeStore.detainees
//     .slice()
//     .sort((a, b) => new Date(b.detention_date) - new Date(a.detention_date))
//     .slice(0, 3);
// });

// const recentStaff = computed(() => {
//   return staffStore.staff
//     .slice()
//     .sort(
//       (a, b) =>
//         new Date(b.created_at || "2024-01-01") -
//         new Date(a.created_at || "2024-01-01")
//     )
//     .slice(0, 3);
// });

const getProgressColor = (ratio: any) => {
  if (ratio < 0.7) return "#67C23A";
  if (ratio < 0.9) return "#E6A23C";
  return "#F56C6C";
};

const formatDate = (dateStr: any) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-row {
  margin-top: 20px;
}

.stats-card {
  height: 120px;
}

.stats-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stats-icon {
  margin-right: 20px;
  padding: 15px;
  border-radius: 50%;
  color: white;
}

.prison-card .stats-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.detainee-card .stats-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.staff-card .stats-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.identity-card .stats-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stats-number {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
}

.stats-label {
  color: #7f8c8d;
  font-size: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-4 {
  margin-top: 20px;
}
</style>
