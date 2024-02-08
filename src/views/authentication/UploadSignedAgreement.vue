<template>
  <section class="login-area inner-page pb-5">
    <div class="container">
      <div class="loginform dir-rtl">
        <div class="form-cont bg-white">
          <div v-if="!isAgreementSent">
            <div class="login-welcome-container row">
              <div class="col-12 title">
                توقيع الاتفاقية
              </div>
            </div>
            <div class="row mb-4" v-if="signedAgreement">
              <label>اتفاقية الشراكة الموقعة</label>
              <div class="file-uploader d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="logo"></div>
                  <div class="logo-name">
                    {{ signedAgreement?.name }}
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <button
                    class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                    @click.stop="removeSignedAgreement"
                    type="button">
                    <i class="pi pi-times px-1"></i>
                    <span class="pb-1">إلغاء</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="row mb-4">
              <label>اتفاقية الشراكة</label>
              <div class="file-uploader d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="logo"></div>
                  <div class="logo-name">
                    {{ lastUploadedAgreement.name }}
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <button
                    class="btn btn-lg btn-primary btn-block download-btn d-flex justify-content-between align-items-center"
                    style="margin-left: 0.5rem"
                    type="button"
                    @click.stop="downloadAgreement">
                    <div class="download-icon"></div>
                    تحميل الاتفاقية
                  </button>
                </div>
              </div>
            </div>
            <div class="row mb-4" v-if="!signedAgreement">
              <div class="d-flex align-items-center">
                <button
                  class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center fw-bold fs-6"
                  @click.stop="$refs.signed_agreement.$el.click()"
                  type="button">
                  <div class="upload-icon"></div>
                  رفع اتفاقية الشراكة الموقعة
                </button>
              </div>
            </div>
            <InputText
              ref="signed_agreement"
              class="d-none"
              type="file"
              accept=".pdf"
              @change.stop="onFileChange($event)"
              v-if="!signedAgreement"
            />
            <div class="text-center">
              <Button
                label="إرسال"
                autofocus
                @click="send"
                :disabled="!signedAgreement"
                class="p-button-primary p-button-rounded mx-2"
              />
            </div>
          </div>
          <div v-else>
            <div class="confirmation-msg d-flex flex-column justify-content-center align-items-center pb-5">
              <div class="check-circle mb-2">
                <i class="pi pi-check"></i>
              </div>
              <div class="txt">
                <span>
                  تم إرسال الاتفاقية بنجاح
                </span>
              </div>
            </div>
            <button
              id="back-to-login"
              class="btn btn-lg btn-block back-to-login-btn mt-5 mb-3">
              <router-link to="/">
                <div>العودة إلى الصفحة الرئيسية</div>
              </router-link>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AuthService from "@/services/auth.service";
import { STORE_ENUM } from "@/store/store.enums";
import { ToastSeverity } from "primevue/api";
import MediaService from "@/services/media.service";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default {
  name: "UploadSignedAgreement",
  data() {
    return {
      lastUploadedAgreement: {},
      signedAgreement: null,
      isAgreementSent: false
    };
  },
  methods: {
    async send() {
      const file = await toBase64(this.signedAgreement);
      AuthService.uploadSignedAgreement(file)
        .then(({ data: { result } }) => {
          this.signout();
        })
    },
    downloadAgreement() {
      MediaService.downloadFile(this.lastUploadedAgreement.url)
    },
    onFileChange(file) {
      this.signedAgreement = file.target.files[0];
    },
    removeSignedAgreement() {
      this.signedAgreement = null;
    },
    signout() {
      AuthService.logout()
      .then(() => {
        this.$store
          .dispatch(STORE_ENUM.SIGN_OUT)
          .then(() => {
            this.isAgreementSent = true;
          })
          .catch(() => {
            this.$toast.add({ severity: ToastSeverity.ERROR, detail: "حدث خطأ في النظام", life: 3000 });
          });
      })
    }
  },
  mounted() {
    AuthService.getLastAgreement()
      .then(({ data: { result } }) => {
        this.lastUploadedAgreement = result;
        this.lastUploadedAgreement.name = this.lastUploadedAgreement.name.split("/")[2];
      });
  }
};
</script>

<style lang="scss" scoped>
.login-area {
  .container {
    padding: 0 0 45px 0;
  }

  .login-welcome-container {
    padding-bottom: 15px;
    margin-bottom: 15px;
    font-size: 18px;

    .title {
      margin-bottom: 10px;
      font-size: 28px;
      font-weight: bold;
    }
  }

  .form-cont {
    padding: 0 2rem 2rem;
  }

  .loginform {
    display: block;
    max-width: 790px;
    margin: 5px auto;
    direction: rtl;
    text-align: right;
    padding: 1px 108px 94px 108px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    font-weight: lighter;
    background-image: linear-gradient(rgba(255, 255, 255, 0), #f7f7f7);
  }

  .login-btn {
    width: 100%;
    border-radius: 8px;
    padding: 10px;
    background: #38c5be;
    border: none;
    font-size: 22px;
  }

  .btn:not(:disabled):not(.disabled) {
    cursor: pointer;
  }

  .dir-rtl {
    direction: rtl;
  }

  .file-uploader {
    height: 80px;
    border-radius: 5px;
    border: 1px dashed #d9d9d9;
    padding: 10px 20px;
  }

  .download-btn,
  .modify-btn {
    border-radius: 25px;
    font-size: 14px;
    background-color: #d9d9d9;
    color: #3f3f3f;
    border: none;
  }

  .download-btn:hover,
  .modify-btn:hover {
    background-color: #b2b2b2;
    color: #3f3f3f;
  }

  .download-icon,
  .upload-icon {
    background: url("../../assets/icons/download-gray.svg");
    width: 14.5px;
    height: 14.5px;
    margin: 0 0.3rem;
  }

  .download-icon {
    transform: rotate(180deg);
  }

  .logo {
    height: 50px;
    width: 70px;
    background-color: #d9d9d9;
    margin-left: 1rem;
  }

  .logo-name {
    color: #8c8c8c;
    font-size: 14px;
  }

  .p-button-primary {
    width: 200px;
  }

  .confirmation-msg {
    border-bottom: 2px solid #ececec;

    .check-circle {
      background: #e4f8f0;
      padding: 2rem;
      border-radius: 50%;

      i {
        color: #1ea97c;
        font-size: 35px;
      }
    }

    .txt {
      text-align: center;
      color: #1ea97c;
      font-size: 25px;
    }
  }

  .back-to-login-btn {
    width: 100%;
    border-radius: 25px;
    padding: 10px;
    background: #d9d9d9;
    border: none;
    font-size: 22px;

    a {
      text-decoration: none;
      color: black;
    }
  }
}
</style>
