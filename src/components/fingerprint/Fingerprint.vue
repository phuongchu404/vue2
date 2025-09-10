<template>
  <div class="fingerprint-management">
<!--    <div class="header">-->
<!--      <h2>👆 Quản Lý Chỉ Bản</h2>-->
<!--      <p>Quản lý vân tay và thông tin chỉ bản phạm nhân</p>-->
<!--    </div>-->

    <!-- Tìm kiếm -->
    <div class="search-section">
<!--      <h3>🔍 Tìm Kiếm Chỉ Bản</h3>-->
      <div class="form-group">
        <label>Mã phạm nhân</label>
        <input
          type="text"
          v-model="searchForm.detaineeCode"
          placeholder="Nhập mã phạm nhân..."
          @input="handleSearch"
        />
      </div>
      <div class="form-group">
        <label>Họ và tên</label>
        <input
          type="text"
          v-model="searchForm.detaineeName"
          placeholder="Nhập họ và tên..."
          @input="handleSearch"
        />
      </div>
      <div class="form-group">
        <label>&nbsp;</label>
        <button class="btn btn-primary" @click="searchFingerprintCards">
          🔍 Tìm Kiếm
        </button>
      </div>
    </div>

    <!-- Form tạo chỉ bản mới -->
    <div class="form-section">
      <h3>➕ Tạo Chỉ Bản Mới</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label>Mã phạm nhân *</label>
            <input
              type="text"
              v-model="fingerprintForm.personId"
              required
              :disabled="loading"
            />
          </div>
          <div class="form-group">
            <label>Ngày lập *</label>
            <input
              type="date"
              v-model="fingerprintForm.createdDate"
              required
              :disabled="loading"
            />
          </div>
          <div class="form-group">
            <label>Tạo tại</label>
            <input
              type="text"
              v-model="fingerprintForm.createdPlace"
              :disabled="loading"
            />
          </div>
          <div class="form-group">
            <label>Công thức vân tay</label>
            <input
              type="text"
              v-model="fingerprintForm.fpFormula"
              :disabled="loading"
            />
          </div>
          <div class="form-group">
            <label>DP</label>
            <input
              type="text"
              v-model="fingerprintForm.dp"
              :disabled="loading"
            />
          </div>
          <div class="form-group">
            <label>TW</label>
            <input
              type="text"
              v-model="fingerprintForm.tw"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Lý do lập</label>
          <textarea
            v-model="fingerprintForm.reasonNote"
            rows="3"
            :disabled="loading"
          ></textarea>
        </div>

        <!-- Vân tay 10 ngón -->
        <div class="fingerprint-upload-section">
          <h4>👆 Vân Tay 10 Ngón</h4>
          <p>Tải lên ảnh vân tay cho từng ngón tay</p>

          <div class="fingerprint-grid">
            <div
              v-for="finger in fingerList"
              :key="finger.key"
              class="finger-slot"
              @click="selectFingerprint(finger.key)"
            >
              <div class="finger-label">{{ finger.name }}</div>
              <span
                v-if="!fingerprintFiles[finger.key]"
                class="finger-placeholder"
              >
                📷
              </span>
              <img
                v-else
                :src="fingerprintFiles[finger.key].preview"
                class="finger-preview"
              />
            </div>
          </div>

          <input
            type="file"
            ref="fingerprintUpload"
            accept="image/*,.wsq"
            style="display: none"
            @change="uploadFingerprint"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">⏳</span>
            <span v-else>💾</span>
            {{ loading ? "Đang lưu..." : "Lưu Chỉ Bản" }}
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="clearForm"
            :disabled="loading"
          >
            🔄 Làm Mới
          </button>
        </div>
      </form>
    </div>

    <!-- Kết quả tìm kiếm -->
    <div
      class="results-section"
      v-if="filteredFingerprintCards.length > 0 || searchPerformed"
    >
      <h3>📋 Danh Sách Chỉ Bản ({{ filteredFingerprintCards.length }})</h3>

      <div
        v-if="filteredFingerprintCards.length === 0 && searchPerformed"
        class="alert alert-info"
      >
        Không tìm thấy chỉ bản nào.
      </div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã Phạm Nhân</th>
            <th>Tên Phạm Nhân</th>
            <th>Ngày Tạo</th>
            <th>Công Thức VT</th>
            <th>Số Vân Tay</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="card in filteredFingerprintCards" :key="card.id">
            <td>{{ card.id }}</td>
            <td>{{ card.personId }}</td>
            <td>{{ card.detaineeName || "-" }}</td>
            <td>{{ formatDate(card.createdDate) }}</td>
            <td>{{ card.fpFormula || "-" }}</td>
            <td>{{ getFingerprintCount(card.fingerprints) }}/10</td>
            <td>
              <button class="btn btn-secondary" @click="viewDetails(card)">
                👁️ Xem
              </button>
              <button class="btn btn-primary" @click="editCard(card)">
                ✏️ Sửa
              </button>
              <button class="btn btn-danger" @click="deleteCard(card.id)">
                🗑️ Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal xem chi tiết -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="btn btn-secondary" @click="closeModal">❌ Đóng</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedCard">
            <div class="form-grid">
              <div>
                <strong>Mã phạm nhân:</strong> {{ selectedCard.personId }}
              </div>
              <div>
                <strong>Tên phạm nhân:</strong>
                {{ selectedCard.detaineeName || "-" }}
              </div>
              <div>
                <strong>Ngày tạo:</strong>
                {{ formatDate(selectedCard.createdDate) }}
              </div>
              <div>
                <strong>Tạo tại:</strong> {{ selectedCard.createdPlace || "-" }}
              </div>
              <div>
                <strong>Công thức VT:</strong>
                {{ selectedCard.fpFormula || "-" }}
              </div>
              <div><strong>DP:</strong> {{ selectedCard.dp || "-" }}</div>
              <div><strong>TW:</strong> {{ selectedCard.tw || "-" }}</div>
            </div>

            <div v-if="selectedCard.reasonNote" style="margin-top: 20px">
              <strong>Lý do lập:</strong><br />
              {{ selectedCard.reasonNote }}
            </div>

            <h4 style="margin-top: 20px">Vân tay 10 ngón:</h4>
            <div class="fingerprint-grid modal-fingerprint-grid">
              <div
                v-for="finger in fingerList"
                :key="finger.key"
                class="finger-slot modal-finger-slot"
              >
                <img
                  v-if="
                    selectedCard.fingerprints &&
                    selectedCard.fingerprints[finger.key]
                  "
                  :src="
                    selectedCard.fingerprints[finger.key].preview ||
                    selectedCard.fingerprints[finger.key].url
                  "
                  class="finger-preview"
                />
                <span v-else class="finger-missing">❌</span>
                <div class="finger-label">{{ finger.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Thông báo -->
    <div
      v-if="notification.show"
      :class="['alert', `alert-${notification.type}`]"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useFingerprintStore } from "@/stores/fingerprint";
import { useDetaineeStore } from "@/stores";

// Stores
const fingerprintStore = useFingerprintStore();
const detaineeStore = useDetaineeStore();

// Reactive data
const loading = ref(false);
const searchPerformed = ref(false);
const showModal = ref(false);
const selectedCard = ref(null);
const modalTitle = ref("");
const currentFinger = ref(null);
const fingerprintUpload = ref(null);

const searchForm = reactive({
  detaineeCode: "",
  detaineeName: "",
});

const fingerprintForm = reactive({
  personId: "",
  createdDate: new Date().toISOString().split("T")[0],
  createdPlace: "",
  fpFormula: "",
  dp: "",
  tw: "",
  reasonNote: "",
});

const fingerprintFiles = reactive({});

const notification = reactive({
  show: false,
  message: "",
  type: "success",
});

// Finger list configuration
const fingerList = [
  { key: "RIGHT_THUMB", name: "Cái phải" },
  { key: "RIGHT_INDEX", name: "Trỏ phải" },
  { key: "RIGHT_MIDDLE", name: "Giữa phải" },
  { key: "RIGHT_RING", name: "Áp út phải" },
  { key: "RIGHT_LITTLE", name: "Út phải" },
  { key: "LEFT_THUMB", name: "Cái trái" },
  { key: "LEFT_INDEX", name: "Trỏ trái" },
  { key: "LEFT_MIDDLE", name: "Giữa trái" },
  { key: "LEFT_RING", name: "Áp út trái" },
  { key: "LEFT_LITTLE", name: "Út trái" },
];

// Computed properties
const filteredFingerprintCards = computed(() => {
  return fingerprintStore.filteredCards;
});

// Methods
const searchFingerprintCards = async () => {
  try {
    loading.value = true;
    searchPerformed.value = true;
    await fingerprintStore.searchCards(searchForm);
  } catch (error) {
    showNotification("Lỗi khi tìm kiếm chỉ bản!", "error");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  // Debounce search
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(() => {
    searchFingerprintCards();
  }, 500);
};

const selectFingerprint = (finger) => {
  currentFinger.value = finger;
  fingerprintUpload.value.click();
};

const uploadFingerprint = (event) => {
  const file = event.target.files[0];
  if (file && currentFinger.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      fingerprintFiles[currentFinger.value] = {
        file: file,
        preview: e.target.result,
        name: file.name,
        size: file.size,
      };
      showNotification(
        `Đã chọn vân tay ${getFingerName(currentFinger.value)}`,
        "success"
      );
    };
    reader.readAsDataURL(file);
    currentFinger.value = null;
  }
};

const handleSubmit = async () => {
  try {
    // Validate form
    if (!fingerprintForm.personId.trim()) {
      showNotification("Vui lòng nhập mã phạm nhân!", "error");
      return;
    }

    if (!fingerprintForm.createdDate) {
      showNotification("Vui lòng chọn ngày lập!", "error");
      return;
    }

    loading.value = true;

    // Check if detainee exists
    const detainee = await detaineeStore.findByCode(fingerprintForm.personId);
    if (!detainee) {
      showNotification("Không tìm thấy phạm nhân với mã này!", "error");
      return;
    }

    // Prepare fingerprint card data
    const cardData = {
      personId: fingerprintForm.personId,
      createdDate: fingerprintForm.createdDate,
      createdPlace: fingerprintForm.createdPlace,
      fpFormula: fingerprintForm.fpFormula,
      dp: fingerprintForm.dp,
      tw: fingerprintForm.tw,
      reasonNote: fingerprintForm.reasonNote,
      fingerprints: { ...fingerprintFiles },
      detaineeName: detainee.fullName,
    };

    // Save fingerprint card
    await fingerprintStore.createCard(cardData);

    showNotification("Tạo chỉ bản thành công!", "success");
    clearForm();
    searchFingerprintCards();
  } catch (error) {
    showNotification(error.message || "Lỗi khi tạo chỉ bản!", "error");
  } finally {
    loading.value = false;
  }
};

const clearForm = () => {
  Object.assign(fingerprintForm, {
    personId: "",
    createdDate: new Date().toISOString().split("T")[0],
    createdPlace: "",
    fpFormula: "",
    dp: "",
    tw: "",
    reasonNote: "",
  });

  // Clear fingerprint files
  Object.keys(fingerprintFiles).forEach((key) => {
    delete fingerprintFiles[key];
  });
};

const viewDetails = (card) => {
  selectedCard.value = card;
  modalTitle.value = `Chi Tiết Chỉ Bản - ${card.detaineeName || card.personId}`;
  showModal.value = true;
};

const editCard = (card) => {
  showNotification("Chức năng chỉnh sửa đang được phát triển!", "info");
};

const deleteCard = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa chỉ bản này?")) {
    try {
      loading.value = true;
      await fingerprintStore.deleteCard(id);
      showNotification("Đã xóa chỉ bản thành công!", "success");
      searchFingerprintCards();
    } catch (error) {
      showNotification("Lỗi khi xóa chỉ bản!", "error");
    } finally {
      loading.value = false;
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  selectedCard.value = null;
};

const getFingerprintCount = (fingerprints) => {
  return fingerprints ? Object.keys(fingerprints).length : 0;
};

const getFingerName = (finger) => {
  const fingerObj = fingerList.find((f) => f.key === finger);
  return fingerObj ? fingerObj.name : finger;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN");
};

const showNotification = (message, type = "success") => {
  notification.message = message;
  notification.type = type;
  notification.show = true;

  setTimeout(() => {
    notification.show = false;
  }, 3000);
};

// Lifecycle
onMounted(() => {
  searchFingerprintCards();
});
</script>

<style scoped>
.fingerprint-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.header h2 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.form-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.search-grid,
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 15px;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #fff;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled,
.form-group textarea:disabled {
  background: #f8f9fa;
  color: #6c757d;
}

.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, #95e1d3 0%, #fce38a 100%);
  color: #2c3e50;
}

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
}

.fingerprint-upload-section {
  border: 2px dashed #bdc3c7;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  margin: 20px 0;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.fingerprint-upload-section:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.fingerprint-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin: 20px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.finger-slot {
  aspect-ratio: 1;
  border: 2px dashed #bdc3c7;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
  position: relative;
  overflow: hidden;
}

.finger-slot:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.finger-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.finger-placeholder {
  font-size: 24px;
  color: #bdc3c7;
}

.finger-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px;
  font-size: 10px;
  text-align: center;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: white;
}

.data-table th,
.data-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.data-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.data-table tr:hover {
  background: rgba(102, 126, 234, 0.05);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  animation: modalSlide 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-fingerprint-grid {
  max-width: 400px;
  grid-template-columns: repeat(5, 1fr);
}

.modal-finger-slot {
  height: 60px;
  cursor: default;
}

.finger-missing {
  color: #ff6b6b;
  font-size: 20px;
}

@keyframes modalSlide {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 10px;
  font-weight: 500;
  z-index: 1001;
  animation: slideIn 0.3s ease-out;
}

.alert-success {
  background: rgba(81, 207, 102, 0.9);
  color: white;
  border: 1px solid rgba(81, 207, 102, 0.2);
}

.alert-error {
  background: rgba(255, 107, 107, 0.9);
  color: white;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.alert-info {
  background: rgba(52, 152, 219, 0.9);
  color: white;
  border: 1px solid rgba(52, 152, 219, 0.2);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .search-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .fingerprint-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .header h2 {
    font-size: 2rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .modal-content {
    margin: 20px;
    max-width: calc(100% - 40px);
  }
}
</style>