export default {
    computed: {
        dataBrands() {
            return this.cardType === "credit_card" ? "VISA MASTER MADA" : "APPLEPAY";
        }
    },
};
