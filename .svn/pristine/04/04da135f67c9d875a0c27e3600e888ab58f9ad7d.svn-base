<template>
  <div v-loading="ui.loading"
       :element-loading-text="$t('readerCardId')"
  >
    <el-row :gutter="16" class="el-row-card" type="flex">
      <el-col style="margin: 10px">
        <el-row class="el-row-card" :gutter="20">
          <el-card class="box-card" style="min-height: 700px ; max-width: 1900px">
            <h2 style="width: auto;margin: auto;text-align: left;top:30px;border-bottom: 1px solid #e5e5e5;padding: 0px 0px 10px 0px">
              {{ $t('check.info') }}</h2>
            <el-row style="min-height: 450px ; display: flex">
              <el-col
                  style=" width: 47% ; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  margin: 15px ; border-radius: 10px">
                <el-col style="  display:flex; flex-direction : column ;padding: 10px; width: 45%">
                  <img v-show="!dataPassport.image.imageScan"
                       class="imgDisplay2"
                       src="../../assets/passport.png"
                       style="width: 260px; height: 260px; border-radius: 10px;margin: auto"/>
                  <el-image
                      v-show="dataPassport.image.imageScan"
                      :style="{border : isScanPassport && 'solid green 1px'}"
                      style="width: auto; height: 220px; border-radius: 10px"
                      :src="convertBase64ToImage(dataPassport.image.imageScan)"
                      :preview-src-list="[convertBase64ToImage(dataPassport.image.imageScan)]"
                      :initial-index="4"
                      fit="cover"
                  />
                  <h4 style="margin: 10px ; text-align: center">{{ $t('passport') }}</h4>
                  <div style="display: flex;justify-content: center">
                    <el-button class="normal-btn btn-info"
                               type="warning"
                               @click="handleRealPassport">{{ $t('Scan') }}
                    </el-button>
                  </div>
                </el-col>
                <el-col style="margin-left: 30px; width: 50% ">
                  <h4>Document Number : {{ dataPassport.mrzInfo.documentNumber }} </h4>
                  <h4>Document Code : {{ dataPassport.mrzInfo.documentCode }} </h4>
                  <h4>Primary Identifier : {{ dataPassport.mrzInfo.primaryIdentifier }} </h4>
                  <h4>Secondary Identifier : {{ dataPassport.mrzInfo.secondaryIdentifier.split('<').join(' ') }} </h4>
                  <h4>Issuing State : {{ dataPassport.mrzInfo.issuingState }} </h4>
                  <h4>Nationality : {{ dataPassport.mrzInfo.nationality }} </h4>
                  <h4>Gender : {{ dataPassport.mrzInfo.gender }} </h4>
                  <h4>Birth Of Date :
                    {{ dataPassport.mrzInfo.dateOfBirth && formatDate(dataPassport.mrzInfo.dateOfBirth) }} </h4>
                  <h4>Date Of Expiry :
                    {{ dataPassport.mrzInfo.dateOfBirth && formatDate(dataPassport.mrzInfo.dateOfExpiry) }} </h4>
                  <h4 v-show="isScanPassport"
                      style=" margin: 15px ; text-align: center ; color: green">Scan Passport Success </h4>
                </el-col>
              </el-col>
              <el-col
                  style="width: 47%;display: flex; flex-direction :column ;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 10px ; margin: 15px">
                <img v-show="!faceImage"
                     class="imgDisplay2"
                     src="../../assets/face-recognition.png"
                     style="width: 260px; height: 260px; border-radius: 10px ; margin: auto"/>
                <el-image
                    v-show="isFaceImage"
                    :style="{border : isFaceImage && 'solid green 1px'}"
                    :src="this.convertBase64ToImage(faceImage)"
                    style="height: 260px; border-radius: 10px ; margin: auto"/>
                <h4 :style="{color : isFaceImage ? 'green' : 'black'}"
                    style="margin: 10px ; text-align: center">
                  {{ !isFaceImage ? $t('facePictures') : $t('takeFacePicturesSuccess') }}
                </h4>
                <el-button class="normal-btn btn-info"
                           style="margin: auto"
                           type="warning"
                           @click="handleFacePictures">
                  {{ $t('openCamera') }}
                </el-button>

              </el-col>
            </el-row>
            <el-row style="min-height: 450px ; display: flex">
              <el-col
                  style="display: flex; flex-direction: column;  width: 31% ; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  margin: 15px ; border-radius: 10px">
                <svg v-show="!fourLeftFingers"
                     xmlns="http://www.w3.org/2000/svg" viewBox="10 20 220 200"
                     class="img-responsive capture-object"
                     style="width: 260px; height: 260px; padding: 10px ; border: solid black 1px ; border-radius: 10px ; margin: auto">
                  <g fill="none" stroke="#000" stroke-linecap="round">
                    <path stroke-width="1.30524206"
                          d="M77.9926 53.7748c1.3134 6.081.3317 9.7617-4.7997 11.5018-6.1112 2.0722-10.9488.1184-12.7964-7.66-1.438-6.053 1.5608-11.8703 6.4198-12.9313s9.8628 3.0086 11.1762 9.0895z"></path>
                    <path stroke-width="1.29779637"
                          d="M144.712 32.1836c-.3955 6.424-2.2562 8.1858-7.8756 8.8434-4.6966.5496-9.773-1.752-9.2942-10.0424.3714-6.4262 3.4623-11.729 8.2036-11.3978 4.7413.331 9.362 6.173 8.9663 12.5968z"></path>
                    <path stroke-width="1.08709085"
                          d="M30.284 115.206c3.5434 3.7782 4.4096 6.817 1.4607 10.2287-3.512 4.063-7.828 4.7178-12.4807-.044-3.621-3.7057-3.9487-9.1208-.9055-11.9332 3.043-2.8124 8.3824-2.0295 11.9256 1.7486z"></path>
                    <path stroke-width="1.29779637"
                          d="M208.7676 48.603c-2.0428 6.1032-8.4402 6.0792-11.0945 5.118-4.446-1.6103-6.527-6.6703-4.48-12.501 2.1322-6.0735 8.101-10.5082 12.3622-8.403 4.2613 2.105 5.2953 9.563 3.2124 15.786z"></path>
                    <path stroke-width="1.14057875"
                          d="M293.2455 182.8977c-.945.7315-13.568-8.224-11.1526-10.3034 2.4213-2.4198 9.1546-6.7435 11.3022-6.8812 3.382-.2166 7.938 3.2783 8.0716 6.8297.4765 3.3576-8.2213 10.355-8.2213 10.355z"></path>
                    <path stroke-width="1.30524206"
                          d="M564.0633 53.7744c-1.3134 6.081-.3316 9.7618 4.7997 11.5018 6.111 2.0723 10.9487.1184 12.7964-7.6598 1.4378-6.0533-1.561-11.8705-6.42-12.9314-4.859-1.061-9.8626 3.0085-11.176 9.0894z"></path>
                    <path stroke-width="1.29779637"
                          d="M497.3438 32.1833c.3957 6.4238 2.2563 8.1857 7.8758 8.8433 4.6965.5497 9.773-1.752 9.294-10.0424-.3712-6.4262-3.4622-11.729-8.2035-11.3977-4.7412.331-9.3618 6.173-8.9662 12.5968z"></path>
                    <path stroke-width="1.08709085"
                          d="M611.7718 115.2057c-3.5432 3.778-4.4095 6.817-1.4605 10.2287 3.512 4.063 7.8278 4.7177 12.4807-.044 3.621-3.7058 3.9486-9.1208.9055-11.9332-3.043-2.8125-8.3824-2.0296-11.9257 1.7485z"></path>
                    <path stroke-width="1.29779637"
                          d="M433.2884 48.6026c2.0427 6.1033 8.44 6.0793 11.0945 5.118 4.446-1.6103 6.527-6.6703 4.48-12.501-2.1323-6.0734-8.101-10.508-12.3623-8.403-4.2612 2.105-5.2952 9.563-3.2123 15.786z"></path>
                    <path stroke-width="1.14057875"
                          d="M348.8105 182.8973c.945.7316 13.568-8.224 11.1525-10.3034-2.4213-2.42-9.1547-6.7435-11.3022-6.8812-3.382-.2168-7.938 3.2782-8.0716 6.8296-.4765 3.3575 8.2213 10.355 8.2213 10.355z"></path>
                  </g>
                  <g fill="none" stroke="#000" stroke-width="1.32247794">
                    <path
                        d="M212.1672 259.6596c14.452-20.8338 57.4176-59.2124 73.988-70.5076 16.5706-11.2952 20.1535-19.1938 13.3722-24.451-6.7814-5.257-16.288-3.4785-29.6854 4.6757-13.3975 8.1542-44.8686 36.8167-57.298 34.8276-12.4296-1.989-17.6377-16.1326-19.2408-22.786-1.603-6.6533-.135-19.7155 2.807-35.7746 2.942-16.059 12.6787-73.58 14.3882-87.5416 1.7096-13.9616 2.1586-26.1782-5.147-27.7427-7.3057-1.5645-12.989 6.2052-17.2194 18.9305-4.2303 12.7253-12.474 61.824-15.7638 72.6945-3.2898 10.8703-4.6358 19.0648-10.8238 17.5805-6.188-1.4842-6.5086-11.8296-6.989-23.885-.4803-12.0557-5.206-49.567-5.699-66.4447-.493-16.8774-2.9407-31.5157-13.4946-31.9798-10.5538-.4642-10.5283 18.728-10.6857 36.2693-.1573 17.5412 3.6903 64.918 3.962 73.961.2717 9.0428-.483 15.5194-5.8148 16.7245-5.3318 1.2052-10.1644-7.333-12.4906-14.5155-2.326-7.1825-14.0417-40.5862-23.0386-59.5106-8.9968-18.9244-10.5943-30.606-21.8056-27.1826-11.2114 3.4235-7.381 21.78-1.3974 37.676 5.9835 15.896 22.048 56.8475 23.328 65.1802 1.28 8.3327 1.5925 14.0144-2.4597 16.8993-4.052 2.885-8.198 4.1456-16.724-6.8037-8.5258-10.9494-8.5183-12.6788-16.703-22.1856-8.1844-9.5068-24.5558-31.204-34.2967-21.9956-9.741 9.2087 9.055 23.5144 17.1946 35.3602 8.1395 11.8457 15.286 18.6877 22.336 35.6263 7.0503 16.9386 10.1432 42.1644 12.9154 61.1822 2.772 19.018 19.9622 50.6126 55.5633 50.3243 35.601-.2884 64.2305 2.0892 86.9222-34.6054z"></path>
                    <path
                        d="M431.2626 259.7315c-14.452-20.834-57.4176-59.2124-73.988-70.5076-16.5706-11.2953-20.1535-19.194-13.3722-24.451 6.7814-5.2572 16.288-3.4787 29.6854 4.6755 13.3975 8.1542 44.8686 36.8167 57.298 34.8276 12.4296-1.989 17.6377-16.1325 19.2408-22.7858 1.603-6.6533.135-19.7156-2.807-35.7746s-12.6787-73.58-14.3882-87.5417c-1.7096-13.9618-2.1586-26.1783 5.147-27.7428 7.3057-1.5646 12.989 6.2052 17.2194 18.9305 4.2303 12.7253 12.474 61.824 15.7638 72.6944 3.2898 10.8705 4.6358 19.065 10.8238 17.5807 6.188-1.4843 6.5086-11.8296 6.989-23.8852.4803-12.0555 5.206-49.567 5.699-66.4445.493-16.8776 2.9407-31.5158 13.4946-31.98 10.5538-.464 10.5283 18.728 10.6857 36.2693.1574 17.5412-3.6902 64.918-3.962 73.961-.2716 9.0428.483 15.5194 5.815 16.7246 5.3317 1.205 10.1643-7.333 12.4904-14.5157 2.3263-7.1825 14.042-40.5862 23.0387-59.5105 8.997-18.9244 10.5944-30.606 21.8057-27.1825 11.2113 3.4234 7.3808 21.78 1.3974 37.676-5.9835 15.896-22.048 56.8474-23.328 65.18-1.28 8.3328-1.5925 14.0145 2.4596 16.8995 4.0522 2.885 8.198 4.1456 16.724-6.8037 8.526-10.9492 8.5184-12.6787 16.703-22.1855 8.1845-9.5068 24.556-31.204 34.2968-21.9956 9.741 9.2085-9.055 23.5143-17.1946 35.36-8.1395 11.8457-15.286 18.6878-22.336 35.6264-7.0503 16.9385-10.1432 42.1643-12.9154 61.1822-2.772 19.0178-19.9622 50.6125-55.5633 50.3242-35.6012-.2884-64.2307 2.0892-86.9224-34.6053z"></path>
                  </g>
                </svg>
                <el-image
                    v-if="fourLeftFingers"
                    :src="this.convertBase64ToImage(fourLeftFingers)"
                    :style="{border : isFourLeftFingers && 'solid green 1px'}"
                    style="height: 260px; border-radius: 10px;margin: auto"/>
                <h4 :style="{color : isFourLeftFingers ? 'green' : 'black'}"
                    style="text-align: center ; margin: 10px">{{
                    isFourLeftFingers ? $t('scanFourLeftFingersSuccess') : $t('fourLeftFingers')
                  }}</h4>
                <el-button class="normal-btn btn-info"
                           type="warning"
                           style="margin:auto"
                           @click="handleScanFourLeftFingers">
                  {{ $t('Scan') }}
                </el-button>
              </el-col>
              <el-col
                  style="width: 31% ; display: flex;flex-direction: column; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  margin: 15px ; border-radius: 10px">
                <svg v-show="!fourRightFingers"
                     xmlns="http://www.w3.org/2000/svg" viewBox="410 20 220 200"
                     class="img-responsive capture-object"
                     style="width: 260px; height: 260px; padding: 10px ; border: solid black 1px ; border-radius: 10px ; margin: auto">
                  <g fill="none" stroke="#000" stroke-linecap="round">
                    <path stroke-width="1.30524206"
                          d="M77.9926 53.7748c1.3134 6.081.3317 9.7617-4.7997 11.5018-6.1112 2.0722-10.9488.1184-12.7964-7.66-1.438-6.053 1.5608-11.8703 6.4198-12.9313s9.8628 3.0086 11.1762 9.0895z"></path>
                    <path stroke-width="1.29779637"
                          d="M144.712 32.1836c-.3955 6.424-2.2562 8.1858-7.8756 8.8434-4.6966.5496-9.773-1.752-9.2942-10.0424.3714-6.4262 3.4623-11.729 8.2036-11.3978 4.7413.331 9.362 6.173 8.9663 12.5968z"></path>
                    <path stroke-width="1.08709085"
                          d="M30.284 115.206c3.5434 3.7782 4.4096 6.817 1.4607 10.2287-3.512 4.063-7.828 4.7178-12.4807-.044-3.621-3.7057-3.9487-9.1208-.9055-11.9332 3.043-2.8124 8.3824-2.0295 11.9256 1.7486z"></path>
                    <path stroke-width="1.29779637"
                          d="M208.7676 48.603c-2.0428 6.1032-8.4402 6.0792-11.0945 5.118-4.446-1.6103-6.527-6.6703-4.48-12.501 2.1322-6.0735 8.101-10.5082 12.3622-8.403 4.2613 2.105 5.2953 9.563 3.2124 15.786z"></path>
                    <path stroke-width="1.14057875"
                          d="M293.2455 182.8977c-.945.7315-13.568-8.224-11.1526-10.3034 2.4213-2.4198 9.1546-6.7435 11.3022-6.8812 3.382-.2166 7.938 3.2783 8.0716 6.8297.4765 3.3576-8.2213 10.355-8.2213 10.355z"></path>
                    <path stroke-width="1.30524206"
                          d="M564.0633 53.7744c-1.3134 6.081-.3316 9.7618 4.7997 11.5018 6.111 2.0723 10.9487.1184 12.7964-7.6598 1.4378-6.0533-1.561-11.8705-6.42-12.9314-4.859-1.061-9.8626 3.0085-11.176 9.0894z"></path>
                    <path stroke-width="1.29779637"
                          d="M497.3438 32.1833c.3957 6.4238 2.2563 8.1857 7.8758 8.8433 4.6965.5497 9.773-1.752 9.294-10.0424-.3712-6.4262-3.4622-11.729-8.2035-11.3977-4.7412.331-9.3618 6.173-8.9662 12.5968z"></path>
                    <path stroke-width="1.08709085"
                          d="M611.7718 115.2057c-3.5432 3.778-4.4095 6.817-1.4605 10.2287 3.512 4.063 7.8278 4.7177 12.4807-.044 3.621-3.7058 3.9486-9.1208.9055-11.9332-3.043-2.8125-8.3824-2.0296-11.9257 1.7485z"></path>
                    <path stroke-width="1.29779637"
                          d="M433.2884 48.6026c2.0427 6.1033 8.44 6.0793 11.0945 5.118 4.446-1.6103 6.527-6.6703 4.48-12.501-2.1323-6.0734-8.101-10.508-12.3623-8.403-4.2612 2.105-5.2952 9.563-3.2123 15.786z"></path>
                    <path stroke-width="1.14057875"
                          d="M348.8105 182.8973c.945.7316 13.568-8.224 11.1525-10.3034-2.4213-2.42-9.1547-6.7435-11.3022-6.8812-3.382-.2168-7.938 3.2782-8.0716 6.8296-.4765 3.3575 8.2213 10.355 8.2213 10.355z"></path>
                  </g>
                  <g fill="none" stroke="#000" stroke-width="1.32247794">
                    <path
                        d="M212.1672 259.6596c14.452-20.8338 57.4176-59.2124 73.988-70.5076 16.5706-11.2952 20.1535-19.1938 13.3722-24.451-6.7814-5.257-16.288-3.4785-29.6854 4.6757-13.3975 8.1542-44.8686 36.8167-57.298 34.8276-12.4296-1.989-17.6377-16.1326-19.2408-22.786-1.603-6.6533-.135-19.7155 2.807-35.7746 2.942-16.059 12.6787-73.58 14.3882-87.5416 1.7096-13.9616 2.1586-26.1782-5.147-27.7427-7.3057-1.5645-12.989 6.2052-17.2194 18.9305-4.2303 12.7253-12.474 61.824-15.7638 72.6945-3.2898 10.8703-4.6358 19.0648-10.8238 17.5805-6.188-1.4842-6.5086-11.8296-6.989-23.885-.4803-12.0557-5.206-49.567-5.699-66.4447-.493-16.8774-2.9407-31.5157-13.4946-31.9798-10.5538-.4642-10.5283 18.728-10.6857 36.2693-.1573 17.5412 3.6903 64.918 3.962 73.961.2717 9.0428-.483 15.5194-5.8148 16.7245-5.3318 1.2052-10.1644-7.333-12.4906-14.5155-2.326-7.1825-14.0417-40.5862-23.0386-59.5106-8.9968-18.9244-10.5943-30.606-21.8056-27.1826-11.2114 3.4235-7.381 21.78-1.3974 37.676 5.9835 15.896 22.048 56.8475 23.328 65.1802 1.28 8.3327 1.5925 14.0144-2.4597 16.8993-4.052 2.885-8.198 4.1456-16.724-6.8037-8.5258-10.9494-8.5183-12.6788-16.703-22.1856-8.1844-9.5068-24.5558-31.204-34.2967-21.9956-9.741 9.2087 9.055 23.5144 17.1946 35.3602 8.1395 11.8457 15.286 18.6877 22.336 35.6263 7.0503 16.9386 10.1432 42.1644 12.9154 61.1822 2.772 19.018 19.9622 50.6126 55.5633 50.3243 35.601-.2884 64.2305 2.0892 86.9222-34.6054z"></path>
                    <path
                        d="M431.2626 259.7315c-14.452-20.834-57.4176-59.2124-73.988-70.5076-16.5706-11.2953-20.1535-19.194-13.3722-24.451 6.7814-5.2572 16.288-3.4787 29.6854 4.6755 13.3975 8.1542 44.8686 36.8167 57.298 34.8276 12.4296-1.989 17.6377-16.1325 19.2408-22.7858 1.603-6.6533.135-19.7156-2.807-35.7746s-12.6787-73.58-14.3882-87.5417c-1.7096-13.9618-2.1586-26.1783 5.147-27.7428 7.3057-1.5646 12.989 6.2052 17.2194 18.9305 4.2303 12.7253 12.474 61.824 15.7638 72.6944 3.2898 10.8705 4.6358 19.065 10.8238 17.5807 6.188-1.4843 6.5086-11.8296 6.989-23.8852.4803-12.0555 5.206-49.567 5.699-66.4445.493-16.8776 2.9407-31.5158 13.4946-31.98 10.5538-.464 10.5283 18.728 10.6857 36.2693.1574 17.5412-3.6902 64.918-3.962 73.961-.2716 9.0428.483 15.5194 5.815 16.7246 5.3317 1.205 10.1643-7.333 12.4904-14.5157 2.3263-7.1825 14.042-40.5862 23.0387-59.5105 8.997-18.9244 10.5944-30.606 21.8057-27.1825 11.2113 3.4234 7.3808 21.78 1.3974 37.676-5.9835 15.896-22.048 56.8474-23.328 65.18-1.28 8.3328-1.5925 14.0145 2.4596 16.8995 4.0522 2.885 8.198 4.1456 16.724-6.8037 8.526-10.9492 8.5184-12.6787 16.703-22.1855 8.1845-9.5068 24.556-31.204 34.2968-21.9956 9.741 9.2085-9.055 23.5143-17.1946 35.36-8.1395 11.8457-15.286 18.6878-22.336 35.6264-7.0503 16.9385-10.1432 42.1643-12.9154 61.1822-2.772 19.0178-19.9622 50.6125-55.5633 50.3242-35.6012-.2884-64.2307 2.0892-86.9224-34.6053z"></path>
                  </g>
                </svg>
                <el-image
                    v-show="fourRightFingers"
                    :src="this.convertBase64ToImage(fourRightFingers)"
                    :style="{border : isFourRightFingers && 'solid green 1px'}"
                    style="width: auto; height: 260px; border-radius: 10px ; margin: auto"/>

                <h4 :style="{color : isFourRightFingers ? 'green' : 'black'}"
                    style="text-align: center ; margin: 10px">{{
                    isFourRightFingers ? $t('scanFourRightFingersSuccess') : $t('fourRightFingers')
                  }}</h4>
                <el-button class="normal-btn btn-info"
                           type="warning"
                           style="margin: auto"
                           @click="handleScanFourRightFingers">
                  {{ $t('Scan') }}
                </el-button>
              </el-col>
              <el-col
                  style="width: 31% ; display: flex;flex-direction: column; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  margin: 15px ; border-radius: 10px">
                <svg v-show="!twoThumbsFingers"
                     xmlns="http://www.w3.org/2000/svg" viewBox="210 100 220 200"
                     class="img-responsive capture-object"
                     style="width: 260px; height: 260px; padding: 10px ; border: solid black 1px ; border-radius: 10px; margin: auto">
                  <g fill="none" stroke="#000" stroke-linecap="round">
                    <path stroke-width="1.30524206"
                          d="M77.9926 53.7748c1.3134 6.081.3317 9.7617-4.7997 11.5018-6.1112 2.0722-10.9488.1184-12.7964-7.66-1.438-6.053 1.5608-11.8703 6.4198-12.9313s9.8628 3.0086 11.1762 9.0895z"></path>
                    <path stroke-width="1.29779637"
                          d="M144.712 32.1836c-.3955 6.424-2.2562 8.1858-7.8756 8.8434-4.6966.5496-9.773-1.752-9.2942-10.0424.3714-6.4262 3.4623-11.729 8.2036-11.3978 4.7413.331 9.362 6.173 8.9663 12.5968z"></path>
                    <path stroke-width="1.08709085"
                          d="M30.284 115.206c3.5434 3.7782 4.4096 6.817 1.4607 10.2287-3.512 4.063-7.828 4.7178-12.4807-.044-3.621-3.7057-3.9487-9.1208-.9055-11.9332 3.043-2.8124 8.3824-2.0295 11.9256 1.7486z"></path>
                    <path stroke-width="1.29779637"
                          d="M208.7676 48.603c-2.0428 6.1032-8.4402 6.0792-11.0945 5.118-4.446-1.6103-6.527-6.6703-4.48-12.501 2.1322-6.0735 8.101-10.5082 12.3622-8.403 4.2613 2.105 5.2953 9.563 3.2124 15.786z"></path>
                    <path stroke-width="1.14057875"
                          d="M293.2455 182.8977c-.945.7315-13.568-8.224-11.1526-10.3034 2.4213-2.4198 9.1546-6.7435 11.3022-6.8812 3.382-.2166 7.938 3.2783 8.0716 6.8297.4765 3.3576-8.2213 10.355-8.2213 10.355z"></path>
                    <path stroke-width="1.30524206"
                          d="M564.0633 53.7744c-1.3134 6.081-.3316 9.7618 4.7997 11.5018 6.111 2.0723 10.9487.1184 12.7964-7.6598 1.4378-6.0533-1.561-11.8705-6.42-12.9314-4.859-1.061-9.8626 3.0085-11.176 9.0894z"></path>
                    <path stroke-width="1.29779637"
                          d="M497.3438 32.1833c.3957 6.4238 2.2563 8.1857 7.8758 8.8433 4.6965.5497 9.773-1.752 9.294-10.0424-.3712-6.4262-3.4622-11.729-8.2035-11.3977-4.7412.331-9.3618 6.173-8.9662 12.5968z"></path>
                    <path stroke-width="1.08709085"
                          d="M611.7718 115.2057c-3.5432 3.778-4.4095 6.817-1.4605 10.2287 3.512 4.063 7.8278 4.7177 12.4807-.044 3.621-3.7058 3.9486-9.1208.9055-11.9332-3.043-2.8125-8.3824-2.0296-11.9257 1.7485z"></path>
                    <path stroke-width="1.29779637"
                          d="M433.2884 48.6026c2.0427 6.1033 8.44 6.0793 11.0945 5.118 4.446-1.6103 6.527-6.6703 4.48-12.501-2.1323-6.0734-8.101-10.508-12.3623-8.403-4.2612 2.105-5.2952 9.563-3.2123 15.786z"></path>
                    <path stroke-width="1.14057875"
                          d="M348.8105 182.8973c.945.7316 13.568-8.224 11.1525-10.3034-2.4213-2.42-9.1547-6.7435-11.3022-6.8812-3.382-.2168-7.938 3.2782-8.0716 6.8296-.4765 3.3575 8.2213 10.355 8.2213 10.355z"></path>
                  </g>
                  <g fill="none" stroke="#000" stroke-width="1.32247794">
                    <path
                        d="M212.1672 259.6596c14.452-20.8338 57.4176-59.2124 73.988-70.5076 16.5706-11.2952 20.1535-19.1938 13.3722-24.451-6.7814-5.257-16.288-3.4785-29.6854 4.6757-13.3975 8.1542-44.8686 36.8167-57.298 34.8276-12.4296-1.989-17.6377-16.1326-19.2408-22.786-1.603-6.6533-.135-19.7155 2.807-35.7746 2.942-16.059 12.6787-73.58 14.3882-87.5416 1.7096-13.9616 2.1586-26.1782-5.147-27.7427-7.3057-1.5645-12.989 6.2052-17.2194 18.9305-4.2303 12.7253-12.474 61.824-15.7638 72.6945-3.2898 10.8703-4.6358 19.0648-10.8238 17.5805-6.188-1.4842-6.5086-11.8296-6.989-23.885-.4803-12.0557-5.206-49.567-5.699-66.4447-.493-16.8774-2.9407-31.5157-13.4946-31.9798-10.5538-.4642-10.5283 18.728-10.6857 36.2693-.1573 17.5412 3.6903 64.918 3.962 73.961.2717 9.0428-.483 15.5194-5.8148 16.7245-5.3318 1.2052-10.1644-7.333-12.4906-14.5155-2.326-7.1825-14.0417-40.5862-23.0386-59.5106-8.9968-18.9244-10.5943-30.606-21.8056-27.1826-11.2114 3.4235-7.381 21.78-1.3974 37.676 5.9835 15.896 22.048 56.8475 23.328 65.1802 1.28 8.3327 1.5925 14.0144-2.4597 16.8993-4.052 2.885-8.198 4.1456-16.724-6.8037-8.5258-10.9494-8.5183-12.6788-16.703-22.1856-8.1844-9.5068-24.5558-31.204-34.2967-21.9956-9.741 9.2087 9.055 23.5144 17.1946 35.3602 8.1395 11.8457 15.286 18.6877 22.336 35.6263 7.0503 16.9386 10.1432 42.1644 12.9154 61.1822 2.772 19.018 19.9622 50.6126 55.5633 50.3243 35.601-.2884 64.2305 2.0892 86.9222-34.6054z"></path>
                    <path
                        d="M431.2626 259.7315c-14.452-20.834-57.4176-59.2124-73.988-70.5076-16.5706-11.2953-20.1535-19.194-13.3722-24.451 6.7814-5.2572 16.288-3.4787 29.6854 4.6755 13.3975 8.1542 44.8686 36.8167 57.298 34.8276 12.4296-1.989 17.6377-16.1325 19.2408-22.7858 1.603-6.6533.135-19.7156-2.807-35.7746s-12.6787-73.58-14.3882-87.5417c-1.7096-13.9618-2.1586-26.1783 5.147-27.7428 7.3057-1.5646 12.989 6.2052 17.2194 18.9305 4.2303 12.7253 12.474 61.824 15.7638 72.6944 3.2898 10.8705 4.6358 19.065 10.8238 17.5807 6.188-1.4843 6.5086-11.8296 6.989-23.8852.4803-12.0555 5.206-49.567 5.699-66.4445.493-16.8776 2.9407-31.5158 13.4946-31.98 10.5538-.464 10.5283 18.728 10.6857 36.2693.1574 17.5412-3.6902 64.918-3.962 73.961-.2716 9.0428.483 15.5194 5.815 16.7246 5.3317 1.205 10.1643-7.333 12.4904-14.5157 2.3263-7.1825 14.042-40.5862 23.0387-59.5105 8.997-18.9244 10.5944-30.606 21.8057-27.1825 11.2113 3.4234 7.3808 21.78 1.3974 37.676-5.9835 15.896-22.048 56.8474-23.328 65.18-1.28 8.3328-1.5925 14.0145 2.4596 16.8995 4.0522 2.885 8.198 4.1456 16.724-6.8037 8.526-10.9492 8.5184-12.6787 16.703-22.1855 8.1845-9.5068 24.556-31.204 34.2968-21.9956 9.741 9.2085-9.055 23.5143-17.1946 35.36-8.1395 11.8457-15.286 18.6878-22.336 35.6264-7.0503 16.9385-10.1432 42.1643-12.9154 61.1822-2.772 19.0178-19.9622 50.6125-55.5633 50.3242-35.6012-.2884-64.2307 2.0892-86.9224-34.6053z"></path>
                  </g>
                </svg>
                <el-image
                    v-show="twoThumbsFingers"
                    :src="this.convertBase64ToImage(twoThumbsFingers)"
                    :style="{border : isTwoThumbsFingers && 'solid green 1px'}"
                    style="width: auto; height: 260px; border-radius: 10px ; margin: auto"/>
                <h4 :style="{color : isTwoThumbsFingers ? 'green' : 'black'}"
                    style="text-align: center ; margin: 10px">{{
                    isTwoThumbsFingers ? $t('scanTwoThumbsFingersSuccess') : $t('twoThumbsFingers')
                  }}</h4>
                <el-button class="normal-btn btn-info"
                           style=" margin: auto"
                           type="warning"
                           @click="handleScanTwoThumbsFingers">
                  {{ $t('Scan') }}
                </el-button>
              </el-col>
            </el-row>
            <div style="display: flex;justify-content: center ; margin: 30px">
              <el-button class="normal-btn btn-red" type="warning" @click="clear(true)">{{ $t('Clear') }}
              </el-button>
              <el-button class="normal-btn btn-greenlight" @click="handleSubmitData"
                         :disabled="!isScanPassport || !isFaceImage || !isFourLeftFingers || !isFourRightFingers || !isTwoThumbsFingers">
                {{ $t('Submit') }}
              </el-button>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as Utils from "../../utils";
import i18n from "../i18n";
import moment from "moment";

@Component({
  components: {},
})
export default class CheckVisitor extends Vue {
  ui = {
    success: false,
    dialogVisible: false,
    loading: false,
  }
  isScanPassport = false;
  isFaceImage = false;
  isFourLeftFingers = false;
  isFourRightFingers = false;
  isTwoThumbsFingers = false;

  socket: any;

  dataPassport = {
    mrzInfo: {
      documentType: null,
      documentCode: "",
      issuingState: "",
      primaryIdentifier: "",
      secondaryIdentifier: "",
      nationality: "",
      documentNumber: "",
      dateOfBirth: "",
      gender: "",
      dateOfExpiry: "",
      optionalData1: "",
      optionalData2: null,
      personalNumber: "",
      secondaryIdentifierComponents: [
        "",
        ""
      ],
      encoded: ""
    },
    mrz: "",
    image: {
      imageScan: ""
    }
  }

  urlWebsocket: string = 'ws://localhost:16002';
  urlDevice: string = 'http://localhost:16002';

  faceImage = '';
  fourLeftFingers: string = '';
  fourRightFingers: string = '';
  twoThumbsFingers: string = '';

  formatDate(dateString: any) {
    return moment(dateString, 'YYMMDD').format('DD/MM/YYYY');
  }

  convertBase64ToImage(base64: string) {
    if (base64.trim() !== "") {
      return `data:image/jpeg;base64,${base64}`;
    } else {
      return '';
    }
  }

  async handleSetStatusOfTransaction(status: number) {
    let param = `status=${status}`
    let res = await Utils.doGet(this, this.urlDevice + `/transaction/set/status?${param}`);
    return res.code
  }

  async handleRealPassport() {
    this.isScanPassport = false;
    Utils.showSuccess(String(i18n.t("startScanPassport")));
    let codeOfTransaction: any = await this.handleSetStatusOfTransaction(1);
    if (codeOfTransaction == '0') {
      let result = await Utils.doGet(this, this.urlDevice + '/realpass');
      if (result.code == '0') {
        this.dataPassport = result.data
        this.isScanPassport = true;
        Utils.showSuccess(String(i18n.t("scanPassportSuccess")));
        if (!this.isFaceImage) return await this.handleFacePictures()
      } else {
        this.isScanPassport = false;
        Utils.showWarning(String(i18n.t("scanPassportFail")));

      }
    }
  }

  async handleFacePictures() {
    if (!this.isScanPassport) return Utils.showWarning(String(i18n.t("pleaseScanPassportFirst")));
    this.isFaceImage = false;
    this.faceImage = '';
    let codeOfTransaction: any = await this.handleSetStatusOfTransaction(2);
    if (codeOfTransaction == '0') {
      this.socket = new WebSocket(this.urlWebsocket + '/face-ws');
      this.socket.onerror = () => {
        Utils.showWarning(String(i18n.t('connectServiceFailed')));
      };
      this.socket.onmessage = (data: any) => {
        let obj = JSON.parse(data.data as any);
        if (obj.status == 2) {
          Utils.showSuccess(String(i18n.t('takeFacePicturesSuccessful')));
          this.faceImage = obj.image;
          this.socket.close();
          this.socket.onclose = async () => {
            if (!this.isFourLeftFingers) return await this.handleScanFourLeftFingers()
          };
          this.isFaceImage = true
        } else {
          this.faceImage = obj.image;
        }

      };
    } else {
      Utils.showWarning(String(i18n.t("cannotConnectToCamera")));
    }
  }


  async handleScanFourLeftFingers() {
    if (!this.isFaceImage) return Utils.showWarning(String(i18n.t("pleaseTakeFacePicturesFirst")));
    this.isFourLeftFingers = false
    let codeOfTransaction: any = await this.handleSetStatusOfTransaction(3);
    if (codeOfTransaction == '0') {
      this.socket = new WebSocket(this.urlWebsocket + '/finger-ws');
      this.socket.onopen = () => {
        this.socket.send(JSON.stringify(3));

      };
      this.socket.onerror = () => {
        Utils.showWarning(String(i18n.t('connectServiceFailed')));
      };
      this.socket.onmessage = (data: any) => {
        let obj = JSON.parse(data.data as any);
        if (obj.status == 2) {
          Utils.showSuccess(String(i18n.t('scanFourLeftFingersSuccess')));
          this.fourLeftFingers = obj.image;
          console.log(obj)
          this.socket.close();
          this.socket.onclose = async () => {
            if (!this.isFourRightFingers) return await this.handleScanFourRightFingers();
          };
          this.isFourLeftFingers = true
        } else {
          this.fourLeftFingers = obj.image;
        }
      };
    } else {
      Utils.showWarning(String(i18n.t("cannotScanFourLeftFingers")));
    }
  }

  async handleScanFourRightFingers() {
    if (!this.isFourLeftFingers) return Utils.showWarning(String(i18n.t("pleaseVerifiedFourLeftFingersFirst")));
    this.isFourRightFingers = false
    let codeOfTransaction: any = await this.handleSetStatusOfTransaction(4);
    if (codeOfTransaction == '0') {
      this.socket = new WebSocket(this.urlWebsocket + '/finger-ws');
      this.socket.onopen = () => {
        this.socket.send(JSON.stringify(4));
      };
      this.socket.onerror = () => {
        Utils.showWarning(String(i18n.t('connectServiceFailed')));
      };
      this.socket.onmessage = (data: any) => {
        let obj = JSON.parse(data.data as any);

        if (obj.status == 2) {
          Utils.showSuccess(String(i18n.t('scanFourRightFingersSuccess')));
          this.fourRightFingers = obj.image;
          this.socket.close();
          this.socket.onclose = () => {
            if (!this.isTwoThumbsFingers) return this.handleScanTwoThumbsFingers();
          };
          this.isFourRightFingers = true
        } else {
          this.fourRightFingers = obj.image;
        }
      };
    } else {
      Utils.showWarning(String(i18n.t("cannotScanFourRightFingers")));
    }
  }

  async handleScanTwoThumbsFingers() {
    if (!this.isFourRightFingers) return Utils.showWarning(String(i18n.t("pleaseVerifiedFourRightFingersFirst")));
    this.isTwoThumbsFingers = false
    let codeOfTransaction: any = await this.handleSetStatusOfTransaction(5);
    if (codeOfTransaction) {
      this.socket = new WebSocket(this.urlWebsocket + '/finger-ws');
      this.socket.onopen = () => {
        this.socket.send(JSON.stringify(5));
      };
      this.socket.onerror = () => {
        Utils.showWarning(String(i18n.t('connectServiceFailed')));
      };
      this.socket.onmessage = async (data: any) => {
        let obj = JSON.parse(data.data as any);
        if (obj.status == 2) {
          Utils.showSuccess(String(i18n.t('scanTwoThumbsFingersSuccess')));
          this.twoThumbsFingers = obj.image;
          this.socket.close();
          this.isTwoThumbsFingers = true
          await this.handleSetStatusOfTransaction(0);
        } else {
          this.twoThumbsFingers = obj.image;
        }
      };
    } else {
      Utils.showWarning(String(i18n.t("cannotScanTwoThumbsFingers")));
    }
  }

  async clear(notification: boolean) {
    this.isScanPassport = false;
    this.isFaceImage = false;
    this.isFourLeftFingers = false;
    this.isFourRightFingers = false;
    this.isTwoThumbsFingers = false;
    this.faceImage = '';
    this.fourLeftFingers = '';
    this.fourRightFingers = '';
    this.twoThumbsFingers = '';
    this.dataPassport = {
      mrzInfo: {
        documentType: null,
        documentCode: "",
        issuingState: "",
        primaryIdentifier: "",
        secondaryIdentifier: "",
        nationality: "",
        documentNumber: "",
        dateOfBirth: "",
        gender: "",
        dateOfExpiry: "",
        optionalData1: "",
        optionalData2: null,
        personalNumber: "",
        secondaryIdentifierComponents: [
          "",
          ""
        ],
        encoded: ""
      },
      mrz: "",
      image: {
        imageScan: ""
      }
    }
    await this.handleSetStatusOfTransaction(0);
    if (notification) return await Utils.showWarning(String(i18n.t("Clear Data Success")));
    this.socket.close();
  }

  async handleSubmitData() {
    let dataSubmit: any = {}
    this.socket.close();
    await this.handleSetStatusOfTransaction(0);
    dataSubmit.documentNumber = this.dataPassport.mrzInfo.documentNumber
    dataSubmit.documentCode = this.dataPassport.mrzInfo.documentCode
    dataSubmit.primaryIdentifier = this.dataPassport.mrzInfo.primaryIdentifier
    dataSubmit.secondaryIdentifier = this.dataPassport.mrzInfo.secondaryIdentifier.split('<').join(' ')
    dataSubmit.documentType = this.dataPassport.mrzInfo.documentType
    dataSubmit.issuingState = this.dataPassport.mrzInfo.issuingState
    dataSubmit.nationality = this.dataPassport.mrzInfo.nationality
    dataSubmit.gender = this.dataPassport.mrzInfo.gender
    dataSubmit.dateOfBirth = this.dataPassport.mrzInfo.dateOfBirth
    dataSubmit.dateOfExpiry = this.dataPassport.mrzInfo.dateOfExpiry
    dataSubmit.imagePassport = this.dataPassport.image.imageScan
    dataSubmit.imageFace = this.faceImage
    dataSubmit.fourLeftFingers = this.fourLeftFingers
    dataSubmit.fourRightFingers = this.fourRightFingers
    dataSubmit.twoThumbsFingers = this.twoThumbsFingers
    console.log("vao chua")
    let result = await Utils.doPost(this, ' /api/admin/visitor/save-visitor-info', dataSubmit);
    if (result.code == '0') {
      await this.clear(false);
      Utils.showSuccess(String(i18n.t('Save Visitor Info Successful')));
    } else {
      Utils.showWarning(String(i18n.t('Save Visitor Info Fail')));
    }
  }


  async mounted() {
    this.$store.commit('setTemplate', {template: ""})
    this.$store.commit('setImage', {image: ""})
  };

}
</script>
<style>
.text {
  font-size: 14px;
}

.item {
  padding: 12px 0;
}

.el-row-card {
  margin-bottom: 0px;
}

.imgDisplay2 {
  margin: auto;
  /*width: 576px;*/
  /*height: 706px;*/
  width: 512px;
  height: 320px;
  padding: 10px;

  border: 1px solid black;
}

.el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
  color: #FFFFFF;
  cursor: not-allowed;
  background-image: none;
  background-color: #FFF;
  border-color: #9ea7b4;
}

.Blink {
  animation: blinker 0.5s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
}

@keyframes blinker {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.div-fingerprint-view {
  align-content: center;
  /*height: 20%;*/
  display: inline-block;
  align-items: center;
}

.el-input.is-disabled .el-input__inner {
  background-color: #FFF;
  border-color: #DCDFE6;
  color: #606266;
  cursor: not-allowed;
}

</style>
