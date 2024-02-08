export default {
    methods: {
        isValidMobileNumber(mobileNumber) {
            return /^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(mobileNumber);
        },
    }
}