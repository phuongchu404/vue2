<template>
  <div
    class="page-table"
    style="width: 100%; padding-top: 50px; max-width: 1900px"
  >
    <div>
      <el-form
        :model="form"
        :rules="formRules"
        label-width="130px"
        ref="formRef"
      >
        <el-row>
          <el-col style="margin-left: 50px; width: 45%; float: left">
            <el-form-item :label="$t('user.realName')" prop="fullName">
              <el-input
                v-model="form.fullName"
                size="mini"
                style="width: 70%"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('citizen-card.address')" prop="address">
              <el-input
                v-model="form.address"
                size="mini"
                style="width: 70%"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('birth.placeOfBirth')" prop="placeOfBirth">
              <el-input
                v-model="form.placeOfBirth"
                size="mini"
                style="width: 70%"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.gender')" prop="gender">
              <el-select
                v-model="form.gender"
                filterable
                clearable
                size="mini"
                style="width: 180px"
              >
                <el-option
                  v-for="item in genders"
                  :key="item.key"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('common.dateOfBirth')" prop="dateOfBirth">
              <el-date-picker
                size="mini"
                style="width: 180px"
                v-model="form.dateOfBirth"
                type="date"
                value-format="YYYY-MM-DD"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col style="width: 45%; float: left">
            <el-form-item :label="$t('common.idcardNo')" prop="idNumber">
              <el-input
                v-model="form.idNumber"
                type="number"
                maxlength="12"
                style="width: 70%"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('driving.issuedBy')" prop="issuedBy">
              <el-input
                v-model="form.issuedBy"
                style="width: 70%"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('driving.dateRange')"
              prop="dateOfIssuance"
            >
              <el-date-picker
                size="mini"
                style="width: 180px"
                v-model="form.dateOfIssuance"
                type="date"
                value-format="YYYY-MM-DD"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              :label="$t('citizen-card.dateOfExpiry')"
              prop="dateOfExpiry"
            >
              <el-date-picker
                size="mini"
                style="width: 180px"
                v-model="form.dateOfExpiry"
                type="date"
                value-format="YYYY-MM-DD"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row style="margin: 30px">
          <el-col
            style="
              width: 47%;
              min-height: 400px;
              display: flex;
              flex-direction: column;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              margin: 15px;
            "
          >
            <img
              v-if="!faceImage.imageJPG"
              style="height: 260px; width: auto; margin: auto"
              src="../../assets/faceID.jpg"
            />
            <img
              v-if="faceImage.imageJPG"
              style="
                height: 260px;
                width: auto;
                margin: auto;
                border-radius: 10px;
              "
              :style="faceImage.imageWSQ && { border: 'solid green 1px' }"
              :src="convertBase64ToImage(faceImage.imageJPG)"
            />
            <span
              v-if="faceImage.imageJPG && faceLoading"
              style="text-align: center; color: #daa520; margin: 5px"
              >{{ $t("enrollment.pleaseLookAtTheCamera") }}</span
            >
            <span
              v-if="faceImage.imageWSQ"
              style="text-align: center; color: green; margin: 5px"
              >{{ $t("enrollment.takeFaceImageSuccessfully") }}</span
            >
            <div style="margin: auto">
              <el-button
                type="success"
                :loading="ui.loading"
                @click="handleFace()"
                >{{ $t("Chụp ảnh") }}
              </el-button>
            </div>
          </el-col>
          <el-col
            style="
              width: 47%;
              min-height: 400px;
              display: flex;
              flex-direction: column;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              margin: 15px;
            "
          >
            <img style="height: 260px; margin: auto" :src="eyeImage" />
            <div style="margin: auto">
              <el-button
                type="success"
                :loading="ui.loading"
                disabled
                @click="handleFace()"
                >{{ $t("enrollment.irisScan") }}
              </el-button>
            </div>
          </el-col>
        </el-row> -->
        <el-row>
          <div style="margin: 30px">
            <el-select
              v-model="device"
              :placeholder="$t('totalDevices')"
              size="medium"
              style="width: 250px"
            >
              <el-option
                v-for="item in listDevice"
                :key="item.key"
                :label="item.value"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </el-row>
        <el-row v-show="device.key == 'scannerFourFinger'">
          <el-col
            style="
              width: 30%;
              min-height: 400px;
              display: flex;
              flex-direction: column;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              margin: 15px;
            "
          >
            <div style="margin: auto">
              <svg
                v-show="!leftImage.imageJPG"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="14 50 200 100"
                class="img-responsive capture-object"
                style="
                  width: 260px;
                  height: 250px;
                  padding: 10px;
                  border: solid black 1px;
                  border-radius: 10px;
                "
              >
                <g fill="none" stroke="#000" stroke-linecap="round">
                  <path
                    stroke-width="1.30524206"
                    d="M77.9926 53.7748c1.3134 6.081.3317 9.7617-4.7997 11.5018-6.1112 2.0722-10.9488.1184-12.7964-7.66-1.438-6.053 1.5608-11.8703 6.4198-12.9313s9.8628 3.0086 11.1762 9.0895z"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M144.712 32.1836c-.3955 6.424-2.2562 8.1858-7.8756 8.8434-4.6966.5496-9.773-1.752-9.2942-10.0424.3714-6.4262 3.4623-11.729 8.2036-11.3978 4.7413.331 9.362 6.173 8.9663 12.5968z"
                  ></path>
                  <path
                    stroke-width="1.08709085"
                    d="M30.284 115.206c3.5434 3.7782 4.4096 6.817 1.4607 10.2287-3.512 4.063-7.828 4.7178-12.4807-.044-3.621-3.7057-3.9487-9.1208-.9055-11.9332 3.043-2.8124 8.3824-2.0295 11.9256 1.7486z"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M208.7676 48.603c-2.0428 6.1032-8.4402 6.0792-11.0945 5.118-4.446-1.6103-6.527-6.6703-4.48-12.501 2.1322-6.0735 8.101-10.5082 12.3622-8.403 4.2613 2.105 5.2953 9.563 3.2124 15.786z"
                  ></path>
                  <path
                    stroke-width="1.14057875"
                    d="M293.2455 182.8977c-.945.7315-13.568-8.224-11.1526-10.3034 2.4213-2.4198 9.1546-6.7435 11.3022-6.8812 3.382-.2166 7.938 3.2783 8.0716 6.8297.4765 3.3576-8.2213 10.355-8.2213 10.355z"
                  ></path>
                  <path
                    stroke-width="1.30524206"
                    d="M564.0633 53.7744c-1.3134 6.081-.3316 9.7618 4.7997 11.5018 6.111 2.0723 10.9487.1184 12.7964-7.6598 1.4378-6.0533-1.561-11.8705-6.42-12.9314-4.859-1.061-9.8626 3.0085-11.176 9.0894z"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M497.3438 32.1833c.3957 6.4238 2.2563 8.1857 7.8758 8.8433 4.6965.5497 9.773-1.752 9.294-10.0424-.3712-6.4262-3.4622-11.729-8.2035-11.3977-4.7412.331-9.3618 6.173-8.9662 12.5968z"
                  ></path>
                  <path
                    stroke-width="1.08709085"
                    d="M611.7718 115.2057c-3.5432 3.778-4.4095 6.817-1.4605 10.2287 3.512 4.063 7.8278 4.7177 12.4807-.044 3.621-3.7058 3.9486-9.1208.9055-11.9332-3.043-2.8125-8.3824-2.0296-11.9257 1.7485z"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M433.2884 48.6026c2.0427 6.1033 8.44 6.0793 11.0945 5.118 4.446-1.6103 6.527-6.6703 4.48-12.501-2.1323-6.0734-8.101-10.508-12.3623-8.403-4.2612 2.105-5.2952 9.563-3.2123 15.786z"
                  ></path>
                  <path
                    stroke-width="1.14057875"
                    d="M348.8105 182.8973c.945.7316 13.568-8.224 11.1525-10.3034-2.4213-2.42-9.1547-6.7435-11.3022-6.8812-3.382-.2168-7.938 3.2782-8.0716 6.8296-.4765 3.3575 8.2213 10.355 8.2213 10.355z"
                  ></path>
                </g>
                <g fill="none" stroke="#000" stroke-width="1.32247794">
                  <path
                    d="M212.1672 259.6596c14.452-20.8338 57.4176-59.2124 73.988-70.5076 16.5706-11.2952 20.1535-19.1938 13.3722-24.451-6.7814-5.257-16.288-3.4785-29.6854 4.6757-13.3975 8.1542-44.8686 36.8167-57.298 34.8276-12.4296-1.989-17.6377-16.1326-19.2408-22.786-1.603-6.6533-.135-19.7155 2.807-35.7746 2.942-16.059 12.6787-73.58 14.3882-87.5416 1.7096-13.9616 2.1586-26.1782-5.147-27.7427-7.3057-1.5645-12.989 6.2052-17.2194 18.9305-4.2303 12.7253-12.474 61.824-15.7638 72.6945-3.2898 10.8703-4.6358 19.0648-10.8238 17.5805-6.188-1.4842-6.5086-11.8296-6.989-23.885-.4803-12.0557-5.206-49.567-5.699-66.4447-.493-16.8774-2.9407-31.5157-13.4946-31.9798-10.5538-.4642-10.5283 18.728-10.6857 36.2693-.1573 17.5412 3.6903 64.918 3.962 73.961.2717 9.0428-.483 15.5194-5.8148 16.7245-5.3318 1.2052-10.1644-7.333-12.4906-14.5155-2.326-7.1825-14.0417-40.5862-23.0386-59.5106-8.9968-18.9244-10.5943-30.606-21.8056-27.1826-11.2114 3.4235-7.381 21.78-1.3974 37.676 5.9835 15.896 22.048 56.8475 23.328 65.1802 1.28 8.3327 1.5925 14.0144-2.4597 16.8993-4.052 2.885-8.198 4.1456-16.724-6.8037-8.5258-10.9494-8.5183-12.6788-16.703-22.1856-8.1844-9.5068-24.5558-31.204-34.2967-21.9956-9.741 9.2087 9.055 23.5144 17.1946 35.3602 8.1395 11.8457 15.286 18.6877 22.336 35.6263 7.0503 16.9386 10.1432 42.1644 12.9154 61.1822 2.772 19.018 19.9622 50.6126 55.5633 50.3243 35.601-.2884 64.2305 2.0892 86.9222-34.6054z"
                  ></path>
                  <path
                    d="M431.2626 259.7315c-14.452-20.834-57.4176-59.2124-73.988-70.5076-16.5706-11.2953-20.1535-19.194-13.3722-24.451 6.7814-5.2572 16.288-3.4787 29.6854 4.6755 13.3975 8.1542 44.8686 36.8167 57.298 34.8276 12.4296-1.989 17.6377-16.1325 19.2408-22.7858 1.603-6.6533.135-19.7156-2.807-35.7746s-12.6787-73.58-14.3882-87.5417c-1.7096-13.9618-2.1586-26.1783 5.147-27.7428 7.3057-1.5646 12.989 6.2052 17.2194 18.9305 4.2303 12.7253 12.474 61.824 15.7638 72.6944 3.2898 10.8705 4.6358 19.065 10.8238 17.5807 6.188-1.4843 6.5086-11.8296 6.989-23.8852.4803-12.0555 5.206-49.567 5.699-66.4445.493-16.8776 2.9407-31.5158 13.4946-31.98 10.5538-.464 10.5283 18.728 10.6857 36.2693.1574 17.5412-3.6902 64.918-3.962 73.961-.2716 9.0428.483 15.5194 5.815 16.7246 5.3317 1.205 10.1643-7.333 12.4904-14.5157 2.3263-7.1825 14.042-40.5862 23.0387-59.5105 8.997-18.9244 10.5944-30.606 21.8057-27.1825 11.2113 3.4234 7.3808 21.78 1.3974 37.676-5.9835 15.896-22.048 56.8474-23.328 65.18-1.28 8.3328-1.5925 14.0145 2.4596 16.8995 4.0522 2.885 8.198 4.1456 16.724-6.8037 8.526-10.9492 8.5184-12.6787 16.703-22.1855 8.1845-9.5068 24.556-31.204 34.2968-21.9956 9.741 9.2085-9.055 23.5143-17.1946 35.36-8.1395 11.8457-15.286 18.6878-22.336 35.6264-7.0503 16.9385-10.1432 42.1643-12.9154 61.1822-2.772 19.0178-19.9622 50.6125-55.5633 50.3242-35.6012-.2884-64.2307 2.0892-86.9224-34.6053z"
                  ></path>
                </g>
              </svg>
              <img
                v-show="leftImage.imageJPG"
                style="height: 260px; padding: 10px"
                :src="convertBase64ToImage(leftImage.imageJPG)"
              />
            </div>
            <span
              v-if="leftImage.imageJPG && leftFingerLoading"
              style="text-align: center; color: #daa520; margin: 5px"
              >{{ $t("enrollment.scanningLeftFingerprint") }}</span
            >
            <span
              v-if="leftImage.imageWSQ && !leftFingerLoading"
              style="text-align: center; color: green; margin: 5px"
            >
              {{ $t("enrollment.scanLeftFourFingerSuccessfully") }}</span
            >
            <div style="margin: auto">
              <el-button
                type="success"
                :loading="ui.loading"
                @click.native="handleLeftFinger()"
                >{{ $t("enrollment.takeLeftFingerprint") }}
              </el-button>
            </div>
          </el-col>
          <el-col
            style="
              width: 30%;
              min-height: 400px;
              display: flex;
              flex-direction: column;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              margin: 15px;
            "
          >
            <div style="margin: auto">
              <svg
                v-show="!rightImage.imageJPG"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="430 50 200 100"
                class="img-responsive capture-object"
                style="
                  width: 260px;
                  height: 250px;
                  padding: 10px;
                  border: solid black 1px;
                  border-radius: 10px;
                "
              >
                <g fill="none" stroke="#000" stroke-linecap="round">
                  <path
                    stroke-width="1.30524206"
                    d="M77.9926 53.7748c1.3134 6.081.3317 9.7617-4.7997 11.5018-6.1112 2.0722-10.9488.1184-12.7964-7.66-1.438-6.053 1.5608-11.8703 6.4198-12.9313s9.8628 3.0086 11.1762 9.0895z"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M144.712 32.1836c-.3955 6.424-2.2562 8.1858-7.8756 8.8434-4.6966.5496-9.773-1.752-9.2942-10.0424.3714-6.4262 3.4623-11.729 8.2036-11.3978 4.7413.331 9.362 6.173 8.9663 12.5968z"
                  ></path>
                  <path
                    stroke-width="1.08709085"
                    d="M30.284 115.206c3.5434 3.7782 4.4096 6.817 1.4607 10.2287-3.512 4.063-7.828 4.7178-12.4807-.044-3.621-3.7057-3.9487-9.1208-.9055-11.9332 3.043-2.8124 8.3824-2.0295 11.9256 1.7486z"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M208.7676 48.603c-2.0428 6.1032-8.4402 6.0792-11.0945 5.118-4.446-1.6103-6.527-6.6703-4.48-12.501 2.1322-6.0735 8.101-10.5082 12.3622-8.403 4.2613 2.105 5.2953 9.563 3.2124 15.786z"
                  ></path>
                  <path
                    stroke-width="1.14057875"
                    d="M293.2455 182.8977c-.945.7315-13.568-8.224-11.1526-10.3034 2.4213-2.4198 9.1546-6.7435 11.3022-6.8812 3.382-.2166 7.938 3.2783 8.0716 6.8297.4765 3.3576-8.2213 10.355-8.2213 10.355z"
                  ></path>
                  <path
                    stroke-width="1.30524206"
                    d="M564.0633 53.7744c-1.3134 6.081-.3316 9.7618 4.7997 11.5018 6.111 2.0723 10.9487.1184 12.7964-7.6598 1.4378-6.0533-1.561-11.8705-6.42-12.9314-4.859-1.061-9.8626 3.0085-11.176 9.0894z"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M497.3438 32.1833c.3957 6.4238 2.2563 8.1857 7.8758 8.8433 4.6965.5497 9.773-1.752 9.294-10.0424-.3712-6.4262-3.4622-11.729-8.2035-11.3977-4.7412.331-9.3618 6.173-8.9662 12.5968z"
                  ></path>
                  <path
                    stroke-width="1.08709085"
                    d="M611.7718 115.2057c-3.5432 3.778-4.4095 6.817-1.4605 10.2287 3.512 4.063 7.8278 4.7177 12.4807-.044 3.621-3.7058 3.9486-9.1208.9055-11.9332-3.043-2.8125-8.3824-2.0296-11.9257 1.7485z"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M433.2884 48.6026c2.0427 6.1033 8.44 6.0793 11.0945 5.118 4.446-1.6103 6.527-6.6703 4.48-12.501-2.1323-6.0734-8.101-10.508-12.3623-8.403-4.2612 2.105-5.2952 9.563-3.2123 15.786z"
                  ></path>
                  <path
                    stroke-width="1.14057875"
                    d="M348.8105 182.8973c.945.7316 13.568-8.224 11.1525-10.3034-2.4213-2.42-9.1547-6.7435-11.3022-6.8812-3.382-.2168-7.938 3.2782-8.0716 6.8296-.4765 3.3575 8.2213 10.355 8.2213 10.355z"
                  ></path>
                </g>
                <g fill="none" stroke="#000" stroke-width="1.32247794">
                  <path
                    d="M212.1672 259.6596c14.452-20.8338 57.4176-59.2124 73.988-70.5076 16.5706-11.2952 20.1535-19.1938 13.3722-24.451-6.7814-5.257-16.288-3.4785-29.6854 4.6757-13.3975 8.1542-44.8686 36.8167-57.298 34.8276-12.4296-1.989-17.6377-16.1326-19.2408-22.786-1.603-6.6533-.135-19.7155 2.807-35.7746 2.942-16.059 12.6787-73.58 14.3882-87.5416 1.7096-13.9616 2.1586-26.1782-5.147-27.7427-7.3057-1.5645-12.989 6.2052-17.2194 18.9305-4.2303 12.7253-12.474 61.824-15.7638 72.6945-3.2898 10.8703-4.6358 19.0648-10.8238 17.5805-6.188-1.4842-6.5086-11.8296-6.989-23.885-.4803-12.0557-5.206-49.567-5.699-66.4447-.493-16.8774-2.9407-31.5157-13.4946-31.9798-10.5538-.4642-10.5283 18.728-10.6857 36.2693-.1573 17.5412 3.6903 64.918 3.962 73.961.2717 9.0428-.483 15.5194-5.8148 16.7245-5.3318 1.2052-10.1644-7.333-12.4906-14.5155-2.326-7.1825-14.0417-40.5862-23.0386-59.5106-8.9968-18.9244-10.5943-30.606-21.8056-27.1826-11.2114 3.4235-7.381 21.78-1.3974 37.676 5.9835 15.896 22.048 56.8475 23.328 65.1802 1.28 8.3327 1.5925 14.0144-2.4597 16.8993-4.052 2.885-8.198 4.1456-16.724-6.8037-8.5258-10.9494-8.5183-12.6788-16.703-22.1856-8.1844-9.5068-24.5558-31.204-34.2967-21.9956-9.741 9.2087 9.055 23.5144 17.1946 35.3602 8.1395 11.8457 15.286 18.6877 22.336 35.6263 7.0503 16.9386 10.1432 42.1644 12.9154 61.1822 2.772 19.018 19.9622 50.6126 55.5633 50.3243 35.601-.2884 64.2305 2.0892 86.9222-34.6054z"
                  ></path>
                  <path
                    d="M431.2626 259.7315c-14.452-20.834-57.4176-59.2124-73.988-70.5076-16.5706-11.2953-20.1535-19.194-13.3722-24.451 6.7814-5.2572 16.288-3.4787 29.6854 4.6755 13.3975 8.1542 44.8686 36.8167 57.298 34.8276 12.4296-1.989 17.6377-16.1325 19.2408-22.7858 1.603-6.6533.135-19.7156-2.807-35.7746s-12.6787-73.58-14.3882-87.5417c-1.7096-13.9618-2.1586-26.1783 5.147-27.7428 7.3057-1.5646 12.989 6.2052 17.2194 18.9305 4.2303 12.7253 12.474 61.824 15.7638 72.6944 3.2898 10.8705 4.6358 19.065 10.8238 17.5807 6.188-1.4843 6.5086-11.8296 6.989-23.8852.4803-12.0555 5.206-49.567 5.699-66.4445.493-16.8776 2.9407-31.5158 13.4946-31.98 10.5538-.464 10.5283 18.728 10.6857 36.2693.1574 17.5412-3.6902 64.918-3.962 73.961-.2716 9.0428.483 15.5194 5.815 16.7246 5.3317 1.205 10.1643-7.333 12.4904-14.5157 2.3263-7.1825 14.042-40.5862 23.0387-59.5105 8.997-18.9244 10.5944-30.606 21.8057-27.1825 11.2113 3.4234 7.3808 21.78 1.3974 37.676-5.9835 15.896-22.048 56.8474-23.328 65.18-1.28 8.3328-1.5925 14.0145 2.4596 16.8995 4.0522 2.885 8.198 4.1456 16.724-6.8037 8.526-10.9492 8.5184-12.6787 16.703-22.1855 8.1845-9.5068 24.556-31.204 34.2968-21.9956 9.741 9.2085-9.055 23.5143-17.1946 35.36-8.1395 11.8457-15.286 18.6878-22.336 35.6264-7.0503 16.9385-10.1432 42.1643-12.9154 61.1822-2.772 19.0178-19.9622 50.6125-55.5633 50.3242-35.6012-.2884-64.2307 2.0892-86.9224-34.6053z"
                  ></path>
                </g>
              </svg>
              <img
                v-show="rightImage.imageJPG"
                style="height: 260px; padding: 10px"
                :src="convertBase64ToImage(rightImage.imageJPG)"
              />
            </div>
            <span
              v-if="rightImage.imageJPG && rightFingerLoading"
              style="text-align: center; color: #daa520; margin: 5px"
            >
              {{ $t("enrollment.scanningRightFingerprint") }}</span
            >
            <span
              v-if="rightImage.imageWSQ && !rightFingerLoading"
              style="text-align: center; color: green; margin: 5px"
              >{{ $t("enrollment.scanLeftFourFingerSuccessfully") }}</span
            >
            <div style="margin: auto">
              <el-button
                type="success"
                :loading="ui.loading"
                @click.native="handleRightFinger()"
                >{{ $t("enrollment.takeRightFingerprint") }}
              </el-button>
            </div>
          </el-col>
          <el-col
            style="
              width: 30%;
              min-height: 400px;
              display: flex;
              flex-direction: column;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              margin: 15px;
            "
          >
            <div style="margin: auto">
              <svg
                v-show="!twoThumbsImage.imageJPG"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="250 100 150 100"
                class="img-responsive capture-object"
                style="
                  width: 260px;
                  height: 250px;
                  padding: 10px;
                  border: solid black 1px;
                  border-radius: 10px;
                "
              >
                <g fill="none" stroke="#000" stroke-linecap="round">
                  <path
                    stroke-width="1.30524206"
                    d="M77.9926 53.7748c1.3134 6.081.3317 9.7617-4.7997 11.5018-6.1112 2.0722-10.9488.1184-12.7964-7.66-1.438-6.053 1.5608-11.8703 6.4198-12.9313s9.8628 3.0086 11.1762 9.0895z"
                    transform="rotate(-40, 212.1672, 139.6596)"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M144.712 32.1836c-.3955 6.424-2.2562 8.1858-7.8756 8.8434-4.6966.5496-9.773-1.752-9.2942-10.0424.3714-6.4262 3.4623-11.729 8.2036-11.3978 4.7413.331 9.362 6.173 8.9663 12.5968z"
                    transform="rotate(-40, 212.1672, 139.6596)"
                  ></path>
                  <path
                    stroke-width="1.08709085"
                    d="M30.284 115.206c3.5434 3.7782 4.4096 6.817 1.4607 10.2287-3.512 4.063-7.828 4.7178-12.4807-.044-3.621-3.7057-3.9487-9.1208-.9055-11.9332 3.043-2.8124 8.3824-2.0295 11.9256 1.7486z"
                    transform="rotate(-40, 212.1672, 139.6596)"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M208.7676 48.603c-2.0428 6.1032-8.4402 6.0792-11.0945 5.118-4.446-1.6103-6.527-6.6703-4.48-12.501 2.1322-6.0735 8.101-10.5082 12.3622-8.403 4.2613 2.105 5.2953 9.563 3.2124 15.786z"
                    transform="rotate(-40, 212.1672, 139.6596)"
                  ></path>
                  <path
                    stroke-width="1.14057875"
                    d="M293.2455 182.8977c-.945.7315-13.568-8.224-11.1526-10.3034 2.4213-2.4198 9.1546-6.7435 11.3022-6.8812 3.382-.2166 7.938 3.2783 8.0716 6.8297.4765 3.3576-8.2213 10.355-8.2213 10.355z"
                    transform="rotate(-40, 212.1672, 142.0)"
                  ></path>
                  <path
                    stroke-width="1.30524206"
                    d="M564.0633 53.7744c-1.3134 6.081-.3316 9.7618 4.7997 11.5018 6.111 2.0723 10.9487.1184 12.7964-7.6598 1.4378-6.0533-1.561-11.8705-6.42-12.9314-4.859-1.061-9.8626 3.0085-11.176 9.0894z"
                    transform="rotate(40, 431.2626, 139.7315)"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M497.3438 32.1833c.3957 6.4238 2.2563 8.1857 7.8758 8.8433 4.6965.5497 9.773-1.752 9.294-10.0424-.3712-6.4262-3.4622-11.729-8.2035-11.3977-4.7412.331-9.3618 6.173-8.9662 12.5968z"
                    transform="rotate(40, 431.2626, 139.7315)"
                  ></path>
                  <path
                    stroke-width="1.08709085"
                    d="M611.7718 115.2057c-3.5432 3.778-4.4095 6.817-1.4605 10.2287 3.512 4.063 7.8278 4.7177 12.4807-.044 3.621-3.7058 3.9486-9.1208.9055-11.9332-3.043-2.8125-8.3824-2.0296-11.9257 1.7485z"
                    transform="rotate(40, 431.2626, 139.7315)"
                  ></path>
                  <path
                    stroke-width="1.29779637"
                    d="M433.2884 48.6026c2.0427 6.1033 8.44 6.0793 11.0945 5.118 4.446-1.6103 6.527-6.6703 4.48-12.501-2.1323-6.0734-8.101-10.508-12.3623-8.403-4.2612 2.105-5.2952 9.563-3.2123 15.786z"
                    transform="rotate(40, 431.2626, 139.7315)"
                  ></path>
                  <path
                    stroke-width="1.14057875"
                    d="M348.8105 182.8973c.945.7316 13.568-8.224 11.1525-10.3034-2.4213-2.42-9.1547-6.7435-11.3022-6.8812-3.382-.2168-7.938 3.2782-8.0716 6.8296-.4765 3.3575 8.2213 10.355 8.2213 10.355z"
                    transform="rotate(40, 431.2626, 143.7315)"
                  ></path>
                </g>
                <g fill="none" stroke="#000" stroke-width="1.32247794">
                  <path
                    d="M212.1672 259.6596c14.452-20.8338 57.4176-59.2124 73.988-70.5076 16.5706-11.2952 20.1535-19.1938 13.3722-24.451-6.7814-5.257-16.288-3.4785-29.6854 4.6757-13.3975 8.1542-44.8686 36.8167-57.298 34.8276-12.4296-1.989-17.6377-16.1326-19.2408-22.786-1.603-6.6533-.135-19.7155 2.807-35.7746 2.942-16.059 12.6787-73.58 14.3882-87.5416 1.7096-13.9616 2.1586-26.1782-5.147-27.7427-7.3057-1.5645-12.989 6.2052-17.2194 18.9305-4.2303 12.7253-12.474 61.824-15.7638 72.6945-3.2898 10.8703-4.6358 19.0648-10.8238 17.5805-6.188-1.4842-6.5086-11.8296-6.989-23.885-.4803-12.0557-5.206-49.567-5.699-66.4447-.493-16.8774-2.9407-31.5157-13.4946-31.9798-10.5538-.4642-10.5283 18.728-10.6857 36.2693-.1573 17.5412 3.6903 64.918 3.962 73.961.2717 9.0428-.483 15.5194-5.8148 16.7245-5.3318 1.2052-10.1644-7.333-12.4906-14.5155-2.326-7.1825-14.0417-40.5862-23.0386-59.5106-8.9968-18.9244-10.5943-30.606-21.8056-27.1826-11.2114 3.4235-7.381 21.78-1.3974 37.676 5.9835 15.896 22.048 56.8475 23.328 65.1802 1.28 8.3327 1.5925 14.0144-2.4597 16.8993-4.052 2.885-8.198 4.1456-16.724-6.8037-8.5258-10.9494-8.5183-12.6788-16.703-22.1856-8.1844-9.5068-24.5558-31.204-34.2967-21.9956-9.741 9.2087 9.055 23.5144 17.1946 35.3602 8.1395 11.8457 15.286 18.6877 22.336 35.6263 7.0503 16.9386 10.1432 42.1644 12.9154 61.1822 2.772 19.018 19.9622 50.6126 55.5633 50.3243 35.601-.2884 64.2305 2.0892 86.9222-34.6054z"
                    transform="rotate(-40, 212.1672, 139.6596)"
                  />
                  <path
                    d="M431.2626 259.7315c-14.452-20.834-57.4176-59.2124-73.988-70.5076-16.5706-11.2953-20.1535-19.194-13.3722-24.451 6.7814-5.2572 16.288-3.4787 29.6854 4.6755 13.3975 8.1542 44.8686 36.8167 57.298 34.8276 12.4296-1.989 17.6377-16.1325 19.2408-22.7858 1.603-6.6533.135-19.7156-2.807-35.7746s-12.6787-73.58-14.3882-87.5417c-1.7096-13.9618-2.1586-26.1783 5.147-27.7428 7.3057-1.5646 12.989 6.2052 17.2194 18.9305 4.2303 12.7253 12.474 61.824 15.7638 72.6944 3.2898 10.8705 4.6358 19.065 10.8238 17.5807 6.188-1.4843 6.5086-11.8296 6.989-23.8852.4803-12.0555 5.206-49.567 5.699-66.4445.493-16.8776 2.9407-31.5158 13.4946-31.98 10.5538-.464 10.5283 18.728 10.6857 36.2693.1574 17.5412-3.6902 64.918-3.962 73.961-.2716 9.0428.483 15.5194 5.815 16.7246 5.3317 1.205 10.1643-7.333 12.4904-14.5157 2.3263-7.1825 14.042-40.5862 23.0387-59.5105 8.997-18.9244 10.5944-30.606 21.8057-27.1825 11.2113 3.4234 7.3808 21.78 1.3974 37.676-5.9835 15.896-22.048 56.8474-23.328 65.18-1.28 8.3328-1.5925 14.0145 2.4596 16.8995 4.0522 2.885 8.198 4.1456 16.724-6.8037 8.526-10.9492 8.5184-12.6787 16.703-22.1855 8.1845-9.5068 24.556-31.204 34.2968-21.9956 9.741 9.2085-9.055 23.5143-17.1946 35.36-8.1395 11.8457-15.286 18.6878-22.336 35.6264-7.0503 16.9385-10.1432 42.1643-12.9154 61.1822-2.772 19.0178-19.9622 50.6125-55.5633 50.3242-35.6012-.2884-64.2307 2.0892-86.9224-34.6053z"
                    transform="rotate(40, 431.2626, 139.7315)"
                  />
                </g>
              </svg>
              <img
                v-show="twoThumbsImage.imageJPG"
                style="height: 260px; padding: 10px"
                :src="convertBase64ToImage(twoThumbsImage.imageJPG)"
              />
            </div>
            <span
              v-if="twoThumbsImage.imageJPG && twoThumbsLoading"
              style="text-align: center; color: #daa520; margin: 5px"
              >{{ $t("enrollment.scanningThumbFingerprint") }}
            </span>
            <span
              v-if="twoThumbsImage.imageWSQ && !twoThumbsLoading"
              style="text-align: center; color: green; margin: 5px"
            >
              {{ $t("enrollment.scanTwoThumbsFingerSuccessfully") }}</span
            >
            <div style="margin: auto">
              <el-button
                type="success"
                :loading="ui.loading"
                @click.native="handleTwoThumbsFingers()"
                >{{ $t("enrollment.takeThumbFingerprint") }}
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row v-show="device.key == 'scannerOneFinger'">
          <el-col style="display: flex; justify-content: center">
            <div
              style="
                width: 30%;
                min-height: 400px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 10px;
              "
            >
              <img
                v-if="!fingerImage"
                style="height: 200px; padding: 10px; margin: auto"
                src="../../assets/fingerprint.png"
              />
              <img
                v-if="fingerImage"
                style="height: 200px; padding: 10px; margin: auto"
                :src="convertBase64ToImage(fingerImage)"
              />
              <el-select
                v-model="indexOfHandleOneFinger"
                filterable
                size="medium"
                @change="
                  () => {
                    this.fingerImage = '';
                  }
                "
                style="width: 185px; margin: auto"
              >
                <el-option
                  v-for="item in listIndexOfFinger"
                  :key="item.index"
                  :label="item.label"
                  :value="item.index"
                >
                </el-option>
              </el-select>
              <el-button
                style="margin: auto"
                type="success"
                :loading="ui.loading"
                @click.native="handleOneFinger()"
                >{{ $t("enrollment.takeFingerprint") }}</el-button
              >
            </div>
          </el-col>
        </el-row>
        <el-row
          v-if="enrollmentImage.length > 0"
          style="display: flex; justify-content: center"
        >
          <el-col
            style="
              width: 50%;
              border: solid green 1px;
              border-radius: 10px;
              margin: 20px;
            "
          >
            <h4 style="text-align: center">
              {{ $t("enrollment.leftFingerprint") }}
            </h4>
            <div
              style="display: flex; flex-wrap: wrap; justify-content: center"
            >
              <div
                v-for="(item, index) in enrollmentImage"
                :key="index"
                style="margin: 10px"
                v-if="item.index >= 6"
              >
                <img
                  :src="item.imageJPG && convertBase64ToImage(item.imageJPG)"
                  height="140"
                  alt="Image"
                />
                <p>{{ getNameOfListFinger(item.index) }}</p>
              </div>
            </div>
          </el-col>
          <el-col
            style="
              width: 50%;
              border: solid green 1px;
              border-radius: 10px;
              margin: 20px;
            "
          >
            <h4 style="text-align: center">
              {{ $t("enrollment.rightFingerprint") }}
            </h4>
            <div
              style="display: flex; flex-wrap: wrap; justify-content: center"
            >
              <div
                v-for="(item, index) in enrollmentImage"
                :key="index"
                style="margin: 10px"
                v-if="item.index < 6"
              >
                <img
                  :src="item.imageJPG && convertBase64ToImage(item.imageJPG)"
                  height="140"
                  alt="Image"
                />
                <p>{{ getNameOfListFinger(item.index) }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { useI18n } from "vue-i18n";
import axios from "axios";
import moment from "moment";

const { t } = useI18n();

// Reactive data
const ui = reactive({
  loading: false,
  addRecord: false,
  dialogVisible: false,
  scanLoading: false,
});

const faceLoading = ref(false);
const leftFingerLoading = ref(false);
const rightFingerLoading = ref(false);
const twoThumbsLoading = ref(false);
const oneFingerLoading = ref(false);
const indexOfHandleOneFinger = ref(1);

const form = reactive({
  fullName: "",
  idNumber: "",
  dateOfBirth: null,
  gender: "",
  placeOfBirth: "",
  address: "",
  issuedBy: "",
  dateOfIssuance: null,
  dateOfExpiry: null,
});

const genders = [
  { key: 1, value: "Nam" },
  { key: 2, value: "Nữ" },
];

const enrollmentImage = ref<any[]>([]);
const device = ref({
  key: "scannerFourFinger",
  value: "RealScan-10",
});

const listDevice = ref<any[]>([]);
const listIndexOfFinger = [
  { index: 1, label: t("enrollment.rightThumb") },
  { index: 2, label: t("enrollment.rightIndexFinger") },
  { index: 3, label: t("enrollment.rightMiddleFinger") },
  { index: 4, label: t("enrollment.rightRingFinger") },
  { index: 5, label: t("enrollment.rightLittleFinger") },
  { index: 6, label: t("enrollment.leftThumb") },
  { index: 7, label: t("enrollment.leftIndexFinger") },
  { index: 8, label: t("enrollment.leftMiddleFinger") },
  { index: 9, label: t("enrollment.leftRingFinger") },
  { index: 10, label: t("enrollment.leftLittleFinger") },
];

const faceImage = reactive({
  index: 11,
  imageWSQ: "",
  imageJPG: "",
});

const leftImage = reactive({
  index: 0,
  imageWSQ: "",
  imageJPG: "",
});

const rightImage = reactive({
  index: 0,
  imageWSQ: "",
  imageJPG: "",
});

const twoThumbsImage = reactive({
  index: 0,
  imageWSQ: "",
  imageJPG: "",
});

const fingerImage = ref("");
// Form validation
const validateCardId = (rule: any, value: any, callback: any) => {
  const str = value.toString();
  if (str.length != 12) {
    callback(new Error(t("enrollment.idNumberMustBe12Number")));
  } else {
    callback();
  }
};

const formRules = reactive<FormRules>({
  fullName: [
    { required: true, message: t("user.inputRealName"), trigger: "blur" },
  ],
  idNumber: [
    { required: true, message: t("user.inputRealName"), trigger: "blur" },
    { validator: validateCardId, trigger: "blur" },
  ],
  dateOfBirth: [
    { required: true, message: t("user.inputRealName"), trigger: "blur" },
  ],
  gender: [
    { required: true, message: t("user.inputRealName"), trigger: "blur" },
  ],
  placeOfBirth: [
    { required: true, message: t("user.inputRealName"), trigger: "blur" },
  ],
  address: [
    { required: true, message: t("user.inputRealName"), trigger: "blur" },
  ],
  issuedBy: [
    { required: true, message: t("user.inputRealName"), trigger: "blur" },
  ],
  dateOfIssuance: [
    { required: true, message: t("user.inputRealName"), trigger: "blur" },
  ],
  dateOfExpiry: [
    { required: true, message: t("user.inputRealName"), trigger: "blur" },
  ],
});

const formRef = ref<FormInstance>();
let socket: WebSocket | null = null;

// Methods
const convertBase64ToImage = (base64: string) => {
  if (base64.trim() !== "") {
    return `data:image/jpeg;base64,${base64}`;
  } else {
    return "";
  }
};

const getNameOfListFinger = (index: number) => {
  switch (index) {
    case 1:
      return t("enrollment.thumbFinger");
    case 2:
      return t("enrollment.indexFinger");
    case 3:
      return t("enrollment.middleFinger");
    case 4:
      return t("enrollment.ringFinger");
    case 5:
      return t("enrollment.littleFinger");
    case 6:
      return t("enrollment.thumbFinger");
    case 7:
      return t("enrollment.indexFinger");
    case 8:
      return t("enrollment.middleFinger");
    case 9:
      return t("enrollment.ringFinger");
    case 10:
      return t("enrollment.littleFinger");
    default:
      return "";
  }
};

const getListDevice = async () => {
  // try {
  //   const result = await axios.get('http://localhost:7171/devices')
  //   if (result.data.success) {
  //     listDevice.value = Object.entries(result.data.data).map(([key, value]) => ({ key, value }))
  //   }
  // } catch (error) {
  //   console.error('Failed to get devices:', error)
  // }
  listDevice.value = [
    { key: "scannerFourFinger", value: "Thiết bị 4 ngón" },
    { key: "scannerOneFinger", value: "Thiết bị mống mắt" },
  ];
  device.value = listDevice.value[0];
};

const wsDisconnect = async () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

const handleRightFinger = async () => {
  rightFingerLoading.value = true;
  ui.loading = true;
  await wsDisconnect();

  socket = new WebSocket("ws://localhost:7171/four-finger-enroll");
  socket.onopen = () => {
    console.log("connected");
    socket?.send(JSON.stringify(4));
  };

  socket.onerror = () => {
    console.log("Right Finger - connected failed");
    ui.loading = false;
    rightFingerLoading.value = false;
    ElMessage.warning("Connect Client Failed.");
  };

  socket.onmessage = (data: any) => {
    const arr = data.data;
    const obj = JSON.parse(arr);
    if (obj) {
      if (obj.image) {
        rightImage.imageJPG = obj.image;
        return;
      }
      if (!obj.image && obj.imagesFinger) {
        deleteOldIndexInArr(obj.imagesFinger);
        obj.imagesFinger.forEach((image: any) => {
          if (image.index == 0 && image.imageWSQ) {
            Object.assign(rightImage, image);
          }
          if (image.index !== 0 && image.imageWSQ) {
            enrollmentImage.value = enrollmentImage.value.concat(image);
          }
        });
        enrollmentImage.value.sort((a, b) => a.index - b.index);
        ElMessage.success(t("enrollment.scanRightFourFingerSuccessfully"));
        ui.loading = false;
        rightFingerLoading.value = false;
        return;
      }
    }
  };
};

const handleLeftFinger = async () => {
  ui.loading = true;
  leftFingerLoading.value = true;
  await wsDisconnect();

  socket = new WebSocket("ws://localhost:7171/four-finger-enroll");
  socket.onopen = () => {
    console.log("connected");
    socket?.send(JSON.stringify(3));
  };

  socket.onerror = () => {
    console.log("left finger - connected failed");
    ui.loading = false;
    leftFingerLoading.value = false;
    ElMessage.warning("Connect Client Failed.");
  };

  socket.onmessage = (data: any) => {
    const arr = data.data;
    const obj = JSON.parse(arr);
    if (obj) {
      if (obj.image) {
        leftImage.imageJPG = obj.image;
        return;
      }
      if (!obj.image && obj.imagesFinger) {
        deleteOldIndexInArr(obj.imagesFinger);
        obj.imagesFinger.forEach((image: any) => {
          if (image.index == 0 && image.imageWSQ) {
            Object.assign(leftImage, image);
          }
          if (image.index !== 0 && image.imageWSQ) {
            enrollmentImage.value = enrollmentImage.value.concat(image);
          }
        });
        enrollmentImage.value.sort((a, b) => a.index - b.index);
        ElMessage.success(t("enrollment.scanLeftFourFingerSuccessfully"));
        ui.loading = false;
        leftFingerLoading.value = false;
        return;
      }
    }
  };
};

const handleTwoThumbsFingers = async () => {
  twoThumbsLoading.value = true;
  ui.loading = true;
  await wsDisconnect();

  socket = new WebSocket("ws://localhost:7171/four-finger-enroll");
  socket.onopen = () => {
    console.log("connected");
    socket?.send(JSON.stringify(5));
  };

  socket.onerror = () => {
    console.log("two thumbs - connected failed");
    ui.loading = false;
    twoThumbsLoading.value = false;
    ElMessage.warning("Connect Client Failed.");
  };

  socket.onmessage = (data: any) => {
    const arr = data.data;
    const obj = JSON.parse(arr);
    if (obj) {
      if (obj.image) {
        twoThumbsImage.imageJPG = obj.image;
        return;
      }
      if (!obj.image && obj.imagesFinger) {
        deleteOldIndexInArr(obj.imagesFinger);
        obj.imagesFinger.forEach((image: any) => {
          if (image.index == 0 && image.imageWSQ) {
            Object.assign(twoThumbsImage, image);
          }
          if (image.index !== 0 && image.imageWSQ) {
            enrollmentImage.value = enrollmentImage.value.concat(image);
          }
        });
        enrollmentImage.value.sort((a, b) => a.index - b.index);
        ElMessage.success(t("enrollment.scanTwoThumbsFingerSuccessfully"));
        ui.loading = false;
        twoThumbsLoading.value = false;
        return;
      }
    }
  };
};

const handleOneFinger = async () => {
  oneFingerLoading.value = true;
  ui.loading = true;
  await wsDisconnect();

  socket = new WebSocket("ws://localhost:7171/one-finger-enroll");
  socket.onopen = () => {
    console.log("connected");
  };

  socket.onerror = () => {
    console.log("one finger - connected failed");
    ui.loading = false;
    oneFingerLoading.value = false;
    ElMessage.warning("Connect Client Failed.");
  };

  socket.onmessage = (data: any) => {
    const arr = data.data;
    const obj = JSON.parse(arr);
    if (obj) {
      if (obj.quality == 0) {
        if (obj.verifyResponse && obj.verifyResponse.success == false) {
          return ElMessage.warning(obj.verifyResponse.message);
        }
        return (fingerImage.value = obj.image);
      }
      if (obj.quality > 0) {
        const newObj = {
          index: indexOfHandleOneFinger.value,
          imageWSQ: obj.image,
          imageJPG: obj.image,
        };
        fingerImage.value = obj.image;
        enrollmentImage.value = enrollmentImage.value.filter(
          (data) => data.index != newObj.index
        );
        enrollmentImage.value = enrollmentImage.value.concat(newObj);
        enrollmentImage.value.sort((a, b) => a.index - b.index);
        ui.loading = false;
        oneFingerLoading.value = false;
        return ElMessage.success(t("enrollment.scanFingerSuccessfully"));
      }
    }
  };
};

const deleteOldIndexInArr = (newArr: any) => {
  enrollmentImage.value = enrollmentImage.value.filter(
    (obj) => !newArr.some((objOfNewArr: any) => obj.index == objOfNewArr.index)
  );
};

const handleFace = async () => {
  faceLoading.value = true;
  ui.loading = true;
  await wsDisconnect();
  faceImage.imageJPG = "";
  faceImage.imageWSQ = "";

  socket = new WebSocket("ws://localhost:7171/face-detection-ws");
  socket.onopen = () => {
    console.log("connected");
  };

  socket.onerror = () => {
    console.log("Face - connected failed");
    ui.loading = false;
    faceLoading.value = false;
    ElMessage.warning("Connect Client Failed.");
  };

  socket.onmessage = (data: any) => {
    const arr = data.data;
    const obj = JSON.parse(arr);
    if (obj) {
      faceImage.imageJPG = obj.image;
      if (obj.quality > 0) {
        faceImage.imageJPG = obj.image;
        faceImage.imageWSQ = obj.image;
        socket?.close();
        ui.loading = false;
        faceLoading.value = false;
        return ElMessage.success(t("enrollment.takeFaceImageSuccessfully"));
      }
    }
  };
};

const validateForm = async (): Promise<boolean> => {
  if (!formRef.value) return false;
  try {
    await formRef.value.validate();
    return true;
  } catch (error) {
    return false;
  }
};

const handleSaveOrUpdate = async () => {
  const validated = await validateForm();
  if (!validated) return;

  let warningMessage = "";
  if (!faceImage.imageJPG && !faceImage.imageWSQ) {
    return ElMessage.success(t("enrollment.pleaseVerifyFace"));
  }

  for (const data of listIndexOfFinger) {
    const obj = enrollmentImage.value.find(
      (item: any) => item.index === data.index
    );
    if (!obj || obj.imageWSQ == "") {
      warningMessage = t("enrollment.missingFingerprint") + data.label;
      ElMessage.warning(warningMessage);
    }
  }

  if (warningMessage !== "") {
    return;
  }

  let newArr: any[] = [];
  newArr = newArr.concat(faceImage);
  newArr = newArr.concat(leftImage);
  newArr = newArr.concat(rightImage);
  newArr = newArr.concat(twoThumbsImage);
  newArr = newArr.concat(enrollmentImage.value);

  const record: any = {
    fullName: form.fullName,
    idNumber: form.idNumber,
    dateOfBirth: form.dateOfBirth,
    gender: form.gender,
    placeOfBirth: form.placeOfBirth,
    address: form.address,
    issuedBy: form.issuedBy,
    dateOfIssuance: form.dateOfIssuance,
    dateOfExpiry: form.dateOfExpiry,
    enrollmentImageRequests: newArr,
  };

  try {
    // Replace with your actual API call
    const result = await axios.post("/api/admin/enrollment/save", record);
    if (!result.data.success) {
      ElMessage.warning(t("common.insertFail") + t(result.data.message));
    } else {
      await clear(false);
      ElMessage.success(t("common.insertSuccess"));
      ui.dialogVisible = false;
    }
  } catch (error) {
    ElMessage.error("Save failed");
  }
};

const clear = async (isNotification: boolean) => {
  faceLoading.value = false;
  leftFingerLoading.value = false;
  rightFingerLoading.value = false;
  twoThumbsLoading.value = false;
  oneFingerLoading.value = false;
  ui.loading = false;

  Object.assign(form, {
    fullName: "",
    idNumber: "",
    dateOfBirth: null,
    gender: "",
    placeOfBirth: "",
    address: "",
    issuedBy: "",
    dateOfIssuance: null,
    dateOfExpiry: null,
  });

  enrollmentImage.value = [];
  faceImage.imageJPG = "";
  faceImage.imageWSQ = "";
  leftImage.imageJPG = "";
  leftImage.imageWSQ = "";
  rightImage.imageJPG = "";
  rightImage.imageWSQ = "";
  twoThumbsImage.imageJPG = "";
  twoThumbsImage.imageWSQ = "";

  await wsDisconnect();

  if (isNotification) {
    ElMessage.success(t("enrollment.resetSuccess"));
  }
};

onMounted(async () => {
  await getListDevice();
});
</script>
<style scoped lang="scss">
.activation-tab {
  text-align: center;
}

.compact-form {
  margin: 0px;
}

.compact-button {
  padding: 0px;
  margin: 0px;
}

.danger {
  color: red;
}

.danger:disabled {
  color: #bfcbd9;
}

.dialog-info {
  text-align: right;
  padding-bottom: 5px;
}

.text-danger {
  color: #e02d2d;
}
</style>
