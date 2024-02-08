<template>
  <Dialog class="p-dialog-share" v-model:visible="show" :header="'قم باختيار نوع المستخدم'" :dismissableMask="false"
          :modal="true" :draggable="false"
          :breakpoints="{'600px': '75vw', '640px': '90vw'}" :style="{width: '600px'}">
    <div>
      <div class="text-center color-secondary mt-4">يمكنك تغيير نوع المستخدم من اللائحة الجانبية في أي وقت</div>
      <div class="my-4 w-75 m-auto" data-cy="change-user-role-drop-down">
        <Dropdown
          optionLabel="label"
          optionValue="key"
          id="roleDDL"
          v-model="selectedRole"
          class="w-100 dir-rtl"
          :options="roles"
          placeholder="نوع المستخدم"
        />
      </div>
      <div class="d-flex justify-content-center mt-3" @click="submit" data-cy="confirm-btn">
        <Button class="p-button p-button-rounded p-button-primary px-5 mx-auto" label="تأكيد" />
      </div>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import MultiRoleService from "@/services/multi-role.service";
import { ToastSeverity } from "primevue/api";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    roles: {
      type: Array,
      required: true,
      default: []
    }
  },
  data() {
    return {
      selectedRole: null
    };
  },
  components: { Dialog },
  emits: ["close"],
  methods: {
    submit() {
      MultiRoleService.changeRole(this.selectedRole)
        .then(() => {
          this.$toast.add({ severity: ToastSeverity.SUCCESS, detail: "تم تغيير نوع المستخدم بنجاح", life: 3000 });
        })
        .finally(() => {
          this.show = false;
        });
    },
    handleScroll() {
      const dropdownPanel = document.querySelector('.p-dropdown-panel');
      if(!dropdownPanel) {
        return;
      }
      const dropdown = document.querySelector('.p-dialog .w-75');
      dropdownPanel.style.top = Math.round(window.scrollY) + Math.round(dropdown?.getBoundingClientRect().top) + Math.round(dropdown.offsetHeight) + 'px';
    }
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set() {
        this.$emit("close");
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll);
  },
  unmounted () {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style lang="scss">
@import "@/styles/variables";

.color-secondary {
  color: $color-font-lighter;
}

a {
  text-decoration: none !important;
}

.dir-rtl {
  direction: rtl;
}

</style>
