export function calculateAge(dob: string): number {
  // 1) Split and convert to numbers
  const [day, month, year] = dob.split('.').map(part => parseInt(part, 10));

  // 2) Create a Date object (months are 0-indexed)
  const birthDate = new Date(year, month - 1, day);
  if (isNaN(birthDate.getTime())) {
    throw new Error(`Invalid date format: "${dob}". Expected "dd.mm.yyyy".`);
  }

  // 3) Compute preliminary age
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  // 4) Adjust if birthday hasn’t occurred yet this year
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}