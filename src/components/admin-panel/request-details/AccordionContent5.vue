<template>
  <form class="form w-100" v-if="requestDetails && requestDetails.requestInfo">
    <div class="row">
      <div class="col-lg-6">
        <div>
          <label class="mb-2">هل ترغب بإضافة مزود خدمة؟</label>
          <div
            class="d-flex align-items-center mb-3 pb-3"
            style="border-bottom: 1px solid #dadada">
            <div style="margin-left: 1rem">
              <RadioButton
                inputId="rb1"
                id="rb1"
                name="isServiceProvider"
                value="1"
                v-model="requestDetails.requestInfo.isServiceProvider"
              />
              <label for="rb1" style="margin-right: 0.5rem">نعم</label>
            </div>

            <div>
              <RadioButton
                inputId="rb2"
                id="rb2"
                name="isServiceProvider"
                value="0"
                v-model="requestDetails.requestInfo.isServiceProvider"
              />
              <label for="rb2" style="margin-right: 0.5rem">لا</label>
            </div>
          </div>
        </div>

        <div v-if="requestDetails.requestInfo?.isServiceProvider === '1'">
          <div v-for="(serviceProvider, i) in requestDetails.requestInfo.service_provider"
               :key="i" :style="
            i < requestDetails.requestInfo.service_provider.length - 1
              ? 'border-bottom: 1px solid #dadada'
              : 's'">
            <div class="remove-link mb-2 mt-2"
                 v-if="requestDetails.requestInfo.service_provider.length > 1"
                 @click.stop="removeServiceProvider"
            >
              - إلغاء
            </div>
            <Dropdown
              optionLabel="name"
              optionValue="id"
              v-model="serviceProvider.hospital_id"
              :class="[
              'w-100',
              'mt-3',
              {
                'p-invalid': !!(submitted && !e.hospital_id),
              },
            ]"
              :options="hospitals"
              placeholder="اسم المستشفى"
            />
            <div class="form-label-group mb-3" style="position: relative">
              <div class="mt-4">
              <span class="p-float-label">
                <InputText
                  id="discount"
                  type="number"
                  v-model="serviceProvider.discount"
                  :disabled="loading"
                  :class="[
                    'w-100',
                    {
                      'p-invalid': !!(submitted && !e.discount),
                    },
                  ]"
                  style="padding-right: 60px"
                />
                <label for="discount" style="padding-right: 50px">
                  نسبة الخصم
                </label>
              </span>
              </div>
              <div class="percentage-block d-flex align-items-center justify-content-center">
                %
              </div>
            </div>
          </div>
        </div>
        <div
          class="add-link d-flex align-items-center justify-content-center"
          @click.stop="addServiceProvider"
          v-if="requestDetails.requestInfo.isServiceProvider === '1'">
          <div><img src="../../../assets/images/plus.png" alt="plus" /></div>
          <div class="label">إضافة مزود خدمة جديد</div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import EnumService from "@/services/enum.service";

export default {
  name: "accordian-content-5",
  props: ["requestDetails"],
  data() {
    return {
      hospitals: [],
    };
  },
  mounted() {
    this.getHospitals();
  },
  methods: {
    addServiceProvider() {
      if (!this.requestDetails.requestInfo.service_provider) {
        this.requestDetails.requestInfo.service_provider = [];
      }
      this.requestDetails.requestInfo.service_provider.push({
        hospital_id: null,
        discount: null
      });
    },
    removeServiceProvider(index) {
      this.requestDetails.requestInfo.service_provider.splice(index, 1);
    },
    getHospitals() {
      EnumService.hospitals()
        .then(({ data: { result } }) => {
          if (result.length) {
            this.hospitals = result;
          }
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
:deep(.p-float-label > label) {
  left: 0 !important;
  right: 0.75rem;
  font-size: 16px;
}

.add-link {
  cursor: pointer;

  .label {
    color: #12b2aa;
    margin-right: 0.5rem;
  }
}

.percentage-block {
  font-size: 18px;
  position: absolute;
  top: 0;
  right: 0;
  height: 50px;
  width: 50px;
  border-radius: 0 5px 5px 0;
  background: #d9d9d9;
}

.remove-link {
  cursor: pointer;
  text-align: right;
  font-size: 18px;
  color: #12b2aa;
}
</style>
