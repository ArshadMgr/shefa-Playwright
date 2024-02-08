import { formatDate, formatHijriDate, formatMobile, camelToUpper, camelToSnake } from "./helpers"

export const convertToFormData = (flattenObj: any, format = true) => {
  if(format) {
    flattenObj.gregorianBirthdate = formatDate(flattenObj.gregorianBirthdate)
    flattenObj.hijriBirthdate = formatHijriDate(flattenObj.hijriBirthdate)
    flattenObj.mobileNumber = formatMobile(flattenObj.mobileNumber)
    flattenObj.identityType = camelToSnake(flattenObj.identityType)
  }
  const flattenObjEntries = Object.entries(flattenObj)
  const formData = new FormData()
  for (let entry of flattenObjEntries) {
    formData.append(camelToSnake(entry[0]), entry[1] as string)
  }

  return formData;
}