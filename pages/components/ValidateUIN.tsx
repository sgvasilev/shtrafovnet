const validateUIN = (UIN: string): number | string => {
  if (UIN.length === 0) return ""
  let arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  let sumOfUINNUmbers = 0
  if (UIN?.length === 19 || UIN?.length === 24) {
    let isValid: string[] = UIN.split("")
    for (let i = 0; i < isValid.length; i++) {
      sumOfUINNUmbers = sumOfUINNUmbers + +isValid[i] * arr[0]
      arr = arr.concat(arr.splice(0, 1))
    }
    let validation = sumOfUINNUmbers % 11
    if (validation === 10) {
      arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      arr = arr.concat(arr.splice(0, 2))
      sumOfUINNUmbers = 0
      let isValid: string[] = UIN.split("")
      for (let i = 0; i < isValid.length; i++) {
        sumOfUINNUmbers = sumOfUINNUmbers + +isValid[i] * arr[0]
        arr = arr.concat(arr.splice(0, 1))
      }
      validation = sumOfUINNUmbers % 11
    }
    return validation !== 10 ? validation : 0
  } else {
    const message = ""
    return message
  }
}
export default validateUIN
