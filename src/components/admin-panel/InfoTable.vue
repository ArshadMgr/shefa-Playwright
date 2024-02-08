<template>
  <div class="info-table">
    <table class="w-100">
      <thead>
      <slot name="header"></slot>
      </thead>
      <tbody>
      <slot name="body"></slot>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "InfoTable"
};
</script>

<style lang="scss">
.info-table {
  box-shadow: 1px 1px 14px #0000001a;

  thead {
    background: #D4D4D4;

    tr {
      td {
        padding: 10px 20px;
        font-size: 17px;

        &:first-child {
          border-radius: 0 10px 0 0;
        }

        &:last-child {
          border-radius: 10px 0 0 0;
        }
      }
    }
  }

  tbody {

    background: white;

    tr {
      td {
        font-size: 18px;
        font-weight: bold;
        padding: 20px 20px 30px;

        &:first-child {
          border-radius: 0 0 10px 0;
        }

        &:last-child {
          border-radius: 0 0 0 10px;
        }
      }
    }
  }
}
</style>
