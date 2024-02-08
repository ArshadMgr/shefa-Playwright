import { tConvert } from "@/helpers/helpers";

export default {
    methods: {
        formatCreationDate(date) {
            if(!date) {
                return;
            }
            let dateFormatted = date.replace('T', ' ').replaceAll('-', '/').split('.')[0];
            const time = dateFormatted.split(' ')[1];
            let dateWithNoTime;
            if(dateFormatted.split(' ')[0].length <= 1) {
                dateWithNoTime = dateFormatted.split(' ')[2]
            } else {
                dateWithNoTime = dateFormatted.split(' ')[0]
            }
            const timeConverted = tConvert(time);

            return dateWithNoTime + ' ' + timeConverted;
        }
    },
};