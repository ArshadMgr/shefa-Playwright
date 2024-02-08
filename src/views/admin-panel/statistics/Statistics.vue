<template>
  <div>
    <AdminStatistics v-if="isAdmin" />
    <CharityStatistics v-else-if="isCharity" />
    <DonerStatistics v-else-if="isDonor" />
  </div>
</template>

<script>
import JwtUtilService from "@/services/jwt.util.service";
import AdminStatistics from "./AdminStatistics";
import CharityStatistics from "./CharityStatistics";
import DonerStatistics from "./DonorStatistics";

export default {
  data() {
    return {
      isAdmin: JwtUtilService.getClientID()?.includes("admin"),
      isCharity: JwtUtilService.getClientID()?.includes("charity"),
      isDonor: JwtUtilService.getClientID()?.includes("doner")
    };
  },
  components: { AdminStatistics, CharityStatistics, DonerStatistics },
};
</script>
