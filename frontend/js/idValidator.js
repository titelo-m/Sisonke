export function validateSAID(idNumber) {
  if (!idNumber || idNumber.length !== 13 || !/^\d{13}$/.test(idNumber)) {
    return { valid: false, error: 'ID must be exactly 13 digits.' };
  }

  const year = parseInt(idNumber.substring(0, 2), 10);
  const month = parseInt(idNumber.substring(2, 4), 10);
  const day = parseInt(idNumber.substring(4, 6), 10);
  const genderSequence = parseInt(idNumber.substring(6, 10), 10);

  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  let fullYear = currentCentury + year;
  if (fullYear > currentYear) {
    fullYear -= 100;
  }

  const dob = new Date(fullYear, month - 1, day);
  if (
    dob.getFullYear() !== fullYear ||
    dob.getMonth() !== month - 1 ||
    dob.getDate() !== day
  ) {
    return { valid: false, error: 'ID contains an invalid date of birth.' };
  }

  let sum = 0;
  let alternate = false;
  for (let i = idNumber.length - 1; i >= 0; i--) {
    let n = parseInt(idNumber.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) {
        n = (n % 10) + 1;
      }
    }
    sum += n;
    alternate = !alternate;
  }

  if (sum % 10 !== 0) {
    return { valid: false, error: 'ID checksum failed. Please check the number.' };
  }

  const gender = genderSequence < 5000 ? 'Female' : 'Male';

  return { valid: true, gender: gender };
}