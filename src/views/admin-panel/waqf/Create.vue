<template>
  <Card class="mx-auto">
    <template #content>
      <div class="title fs-4 fw-bold mb-4">
        إنشاء وقف
      </div>
      <form>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span class="p-float-label">
                  <InputText
                    id="walletName"
                    v-model="waqfToAdd.name"
                    class="w-100"
                  />
                  <label for="walletName">اسم الوقف</label>
                </span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span class="p-float-label">
                  <InputNumber
                    id="value"
                    v-model="waqfToAdd.target"
                    class="w-100"
                  />
                  <label for="value">مبلغ الوقف</label>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span class="p-float-label">
                  <Textarea v-model="waqfToAdd.description" :autoResize="true" rows="3" class="w-100" />
                  <label for="value">الوصف</label>
                </span>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mt-0">
              <label class="color-secondary">صورة الوقف</label>
              <div class="association-logo">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="logo"></div>
                  <div class="logo-name"
                       :title="waqfToAdd.waqf_image?.name || waqfToAdd.waqf_image">
                    {{ waqfToAdd.waqf_image?.name || waqfToAdd.waqf_image }}
                  </div>
                  <div class="d-flex align-items-center" v-if="!waqfToAdd.waqf_image">
                    <button
                      class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                      @click.stop="$refs.waqf_image.$el.click()"
                      type="button">
                      <div class="upload-icon"></div>
                      رفع المرفق
                    </button>
                  </div>
                  <div class="d-flex align-items-center" v-else>
                    <button
                      class="btn btn-lg btn-primary btn-block modify-btn d-flex justify-content-between align-items-center"
                      @click.stop="removeAttachment"
                      type="button">
                      <i class="pi pi-times mx-2"></i>
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
              <InputText
                ref="waqf_image"
                class="d-none"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                v-model="uploadedImage"
                @change.stop="fileChange($event, 'waqf_image')"
              />
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="form-label-group mb-3">
              <div class="mt-4">
                <span class="p-float-label">
                  <InputNumber
                    id="period"
                    v-model="waqfToAdd.interval"
                    class="w-100"
                  />
                  <label for="value">مدة العرض (يوم)</label>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Button
            label="إغلاق"
            class="p-button-secondary p-button-rounded mx-2 width-180"
            @click="close"
          />
          <Button
            label="تفعيل"
            class="p-button-primary p-button-rounded mx-2 width-180"
            @click.stop="activate"
            :disabled="!(waqfToAdd.name &&
            waqfToAdd.target &&
            waqfToAdd.description &&
            waqfToAdd.waqf_image)"
          />
        </div>
      </form>
    </template>
  </Card>
</template>

<script>

import { ToastSeverity } from "primevue/api";
import Textarea from "primevue/textarea";
import WaqfService from "@/services/waqf.service";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default {
  name: "Create",
  components: { Textarea },
  data() {
    return {
      waqfToAdd: {},
      diseases: [],
      uploadedImage: null
    };
  },
  methods: {

    async activate() {
      this.waqfToAdd.image = this.waqfToAdd.waqf_image ? await toBase64(this.waqfToAdd.waqf_image) : "";

      const payload = {
        name: this.waqfToAdd.name,
        target: this.waqfToAdd.target,
        description: this.waqfToAdd.description,
        ...(this.waqfToAdd.image && {
          image: this.waqfToAdd.image
        }),
        ...(this.waqfToAdd.interval && {
          interval: this.waqfToAdd.interval
        })
      }

      WaqfService.createWaqf(payload)
        .then(({ data: { response } }) => {
          this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم إنشاء الوقف بنجاح", life: 3000 });
          this.$router.push("/admin-panel/waqf");
        })
        .catch((error) => {
          //this.$toast.add({ severity: ToastSeverity.ERROR, detail: "تم إنشاء المحفظة بنجاح", life: 3000 });
        });
    },
    close() {
      this.$router.push("/admin-panel/waqf");
    },
    fileChange(event, key) {
      if (
        event &&
        event.target &&
        event.target.files &&
        event.target.files.length
      ) {
        this.waqfToAdd[key] = event.target.files[0];
      }
    },
    removeAttachment() {
      this.uploadedImage = null;
      this.waqfToAdd.waqf_image = null
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.logo {
  height: 50px;
  flex: 0 0 70px;
  background-color: #d9d9d9;
  margin-left: 1rem;
}

.logo-name {
  color: #8c8c8c;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap !important;
}

.download-btn,
.modify-btn {
  border-radius: 25px;
  font-size: 14px;
  background-color: #d9d9d9;
  color: #3f3f3f;
  border: none;

  &:hover {
    background-color: #b2b2b2;
    color: #3f3f3f;
  }
}

.association-logo {
  height: 80px;
  border-radius: 5px;
  border: 1px dashed #d9d9d9;
  padding: 10px 20px;
}

::v-deep(.p-card) {
  max-width: 500px;
  box-shadow: $box-shadow-card;
  border-radius: $border-radius-default;
  margin-bottom: 8rem;

  .p-card-body {
    box-shadow: none;
  }
}

:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 16px;
}

.color-secondary {
  color: $color-font-lighter;
}
</style>
