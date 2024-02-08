<template>
  <div>
    <div class="welcome-container row mb-3">
      <div class="col-12 title">اتفاقيات مزود الخدمة</div>
      <div class="col-12 sub-title">هل ترغب بإضافة مزود خدمة؟</div>
    </div>
    <form class="form-step1 w-100">
      <div
        class="d-flex align-items-center mb-3 pb-3"
        style="border-bottom: 1px solid #dadada"
      >
        <div style="margin-left: 1rem">
          <RadioButton
            inputId="rb1"
            name="flag"
            value="yes"
            v-model="payload.flag"
            :class="[
              {
                'p-invalid': submitted && !payload.flag ? true : false,
              },
            ]"
            @click="
              () => {
                payload.service_provider = [
                  { hospital_id: null, discount: null },
                ];
                submitted = false;
              }
            "
          />
          <label for="rb1" style="margin-right: 0.5rem">نعم</label>
        </div>

        <div>
          <RadioButton
            inputId="rb2"
            name="flag"
            value="no"
            v-model="payload.flag"
            :class="[
              {
                'p-invalid': submitted && !payload.flag ? true : false,
              },
            ]"
            @click="
              () => {
                payload.service_provider = null;
                submitted = false;
              }
            "
          />
          <label for="rb2" style="margin-right: 0.5rem">لا</label>
        </div>
      </div>

      <div v-if="payload.flag === 'yes'">
        <div
          v-for="(e, i) in payload.service_provider"
          :key="i"
          :style="
            i < payload.service_provider.length - 1
              ? 'border-bottom: 1px solid #dadada'
              : 's'
          "
        >
          <div
            class="remove-link mb-2 mt-2"
            v-if="payload.service_provider.length > 1"
            @click.stop="remove"
          >
            - إلغاء
          </div>
          <Dropdown
            optionLabel="name"
            optionValue="id"
            v-model="e.hospital_id"
            :disabled="loading"
            :class="[
              'w-100',
              'mt-3',
              {
                'p-invalid': submitted && !e.hospital_id ? true : false,
              },
            ]"
            :options="getOptions(e)"
            placeholder="اسم المستشفى"
          />
          <div class="form-label-group mb-3" style="position: relative">
            <div class="mt-4">
              <span class="p-float-label">
                <InputText
                  id="discount"
                  type="number"
                  v-model="e.discount"
                  :min="0"
                  :max="100"
                  :disabled="loading"
                  :class="[
                    'w-100',
                    {
                      'p-invalid':
                        submitted &&
                        (!e.discount || !(e.discount >= 0 && e.discount <= 100))
                          ? true
                          : false,
                    },
                  ]"
                  style="padding-right: 60px"
                />
                <label for="discount" style="padding-right: 50px">
                  نسبة الخصم
                </label>
              </span>
            </div>
            <div
              class="percentage-block d-flex align-items-center justify-content-center"
            >
              %
            </div>
          </div>
        </div>

        <div
          class="add-link d-flex align-items-center justify-content-center"
          @click.stop="add"
        >
          <div><img src="../../../assets/images/plus.png" alt="plus" /></div>
          <div class="label">إضافة مزود خدمة جديد</div>
        </div>
        <div class="border-container"></div>
      </div>
    </form>
    <div class="row">
      <div class="col-lg-6">
        <button
          id="close-btn"
          class="btn btn-lg btn-secondary btn-block close-btn"
          type="button"
          @click.stop="$emit('close')"
        >
          السابق
        </button>
      </div>
      <div class="col-lg-6">
        <button
          id="tracking-btn"
          class="btn btn-lg btn-primary btn-block tracking-btn"
          type="button"
          @click.stop="submit"
        >
          متابعة
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import RadioButton from "primevue/radiobutton";
import Dropdown from "primevue/dropdown";

import EnumService from "../../../services/enum.service";

export default {
  name: "create-account-step4",
  props: ["payload"],
  emits: [
    "close",
    "next",
    "addServiceProvider",
    "removeServiceProvider",
    "openVerificationStep4",
  ],
  components: { RadioButton, Dropdown },
  data() {
    return {
      loading: false,
      error: null,
      submitted: false,
      options: [],
    };
  },
  methods: {
    getOptions(e) {
      return this.options.filter((rec) => {
        if (rec && rec.id) {
          const rec_found = this.payload.service_provider.find((s_p_rec) => {
            return (
              s_p_rec &&
              s_p_rec.hospital_id &&
              (!e.hospital_id ||
                (e.hospital_id && s_p_rec.hospital_id !== e.hospital_id)) &&
              s_p_rec.hospital_id === rec.id
            );
          });
          return !rec_found;
        } else {
          return false;
        }
      });
    },
    submit() {
      this.submitted = true;
      const buggy_records =
        this.payload.service_provider && this.payload.service_provider.length
          ? this.payload.service_provider.filter(
            (each) =>
              !(
                each.hospital_id &&
                each.discount &&
                each.discount >= 0 &&
                each.discount <= 100
              )
          )
          : [];

      if (
        (this.payload.flag === "yes" && !buggy_records.length) ||
        this.payload.flag === "no"
      ) {
        if (
          !(
            this.payload.is_chairman_mobile_verified ||
            (this.payload.the_charity_manager_is_the_chairman &&
              this.payload.chairman_mobile === this.payload.mobile_number)
          ) ||
          !this.payload.is_charity_email_verified
        )
          this.$emit("openVerificationStep4");
        else this.$emit("next");
      }
    },
    add() {
      this.$emit("addServiceProvider");
    },
    remove(index) {
      this.$emit("removeServiceProvider", index);
    },
    enum_hospitals() {
      this.loading = true;
      this.error = null;

      EnumService.hospitals()
        .then(({ data }) => {
          if (data.result.length) this.options = data.result;
        })
        .catch((error) => {
          this.error = error;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.enum_hospitals();
  },
};
</script>

<style lang="scss" scoped>
.welcome-container {
  .title {
    font-size: 24px;
    font-weight: bold;
  }
  .sub-title {
    font-size: 18px;
  }
}
.border-container {
  border-top: 1px solid #dadada;
  padding-top: 2rem;
  margin-top: 2rem;
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
  top: 0px;
  right: 0px;
  height: 50px;
  width: 50px;
  border-radius: 0px 5px 5px 0px;
  background: #d9d9d9;
}

.remove-link {
  cursor: pointer;
  text-align: right;
  font-size: 18px;
  color: #12b2aa;
}
.tracking-btn {
  display: block;
  margin: 0 auto;
  width: 80%;
  border-radius: 25px;
  padding: 10px;
  background: #12b2aa;
  color: #ffffff;
  border: none;
  font-size: 18px;
}

.tracking-btn:hover {
  background-color: #0e8e88 !important;
  border: none;
}

.close-btn {
  display: block;
  margin: 0 auto;
  width: 80%;
  border-radius: 25px;
  padding: 10px;
  background: #d9d9d9;
  color: #3f3f3f;
  border: none;
  font-size: 18px;
}
</style>
