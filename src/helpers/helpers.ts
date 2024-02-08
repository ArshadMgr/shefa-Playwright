export const formatDate = (date: Date) => {
  let year = date.toLocaleString("default", { year: "numeric" });
  let month = date.toLocaleString("default", { month: "2-digit" });
  let day = date.toLocaleString("default", { day: "2-digit" });
  return `${year}-${month}-${day}`;
};

export const formatHijriDate = (date: any) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return `${year}-${month}-${day}`;
};

export const formatMobile = (mobile: string) => {
  return mobile ? mobile.replace("-", "") : false;
};

export const tConvert = (time: any) => {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? 'ص' : 'م'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

export const formatCreationDate = (date: string) => {
  if(!date) {
    return;
  }
  let dateFormated = date.replace('T', ' ').replaceAll('-', '/').split('.')[0];
  const time = dateFormated.split(' ')[1];
  const dateWithNoTime = dateFormated.split(' ')[0]
  const timeConverted = tConvert(time);

  return dateWithNoTime + ' ' + timeConverted;
}

export const toIndianDigits = (num: string) => {
    const id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    if(!num) {
        return;
    }
    return num.toString().replace(/\d/g, (w) => {
        return id[+w]
    });
}

export const snakeToCamel = (str: string) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );

export const camelToSnake = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const camelToUpper = (str: string) => {
  if(!str) {
    return false;
  } else {
    const words = str.split("_");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(' ')
  }
}

export const checkIfExist = (value: any) => {
  return value ? value.label : '';
}

export const displayGender = (str: string) => {
  if(str === "M") {
    return 'رجال';
  } else if(str === "F") {
    return 'النساء';
  } else {
    return 'Invalid value';
  }
}

export const isValidSaudiID = (saudiID: string, validateIqama: boolean = false) => {
    saudiID = saudiID.trim();

    if (isNaN(parseInt(saudiID))) return false;
    if (saudiID.length !== 10) return false;

    let type = saudiID.substr(0, 1);
    if (validateIqama && type !== '2' || !validateIqama && type !== '1') return false;

    let sum = 0;
    for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
            let ZFOdd = String('00' + String(Number(saudiID.substr(i, 1)) * 2)).slice(-2);
            sum += Number(ZFOdd.substr(0, 1)) + Number(ZFOdd.substr(1, 1));
        } else {
            sum += Number(saudiID.substr(i, 1));
        }
    }
    return (sum % 10 === 0);
}

