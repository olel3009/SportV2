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

export function calculateAgeAtTime(dob: string, atDate:string): number {
  // 1) Split and convert to numbers
  const [day, month, year] = dob.split('.').map(part => parseInt(part, 10));

  // 2) Create a Date object (months are 0-indexed)
  const birthDate = new Date(year, month - 1, day);
  if (isNaN(birthDate.getTime())) {
    throw new Error(`Invalid date format: "${dob}". Expected "dd.mm.yyyy".`);
  }

  // 1) Split and convert to numbers
  const [setDay, setMonth, setYear] = atDate.split('.').map(part => parseInt(part, 10));

  // 2) Create a Date object (months are 0-indexed)
  const setDate = new Date(setYear, setMonth - 1, setDay);
  if (isNaN(birthDate.getTime())) {
    throw new Error(`Invalid date format: "${dob}". Expected "dd.mm.yyyy".`);
  }

  // 3) Compute preliminary age
  let age = setDate.getFullYear() - birthDate.getFullYear();

  // 4) Adjust if birthday hasn’t occurred yet this year
  const monthDiff = setDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && setDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function parseDDMMYYYY(ddmmyyyy: string): Date {
  // 1. Split on dots. We expect exactly three parts: [day, month, year].
  const parts = ddmmyyyy.split('.');
  if (parts.length !== 3) {
    throw new Error(`Invalid format "${ddmmyyyy}". Expected "dd.mm.yyyy".`);
  }

  const [dayStr, monthStr, yearStr] = parts;

  // 2. Convert to numbers
  const day   = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year  = parseInt(yearStr, 10);

  if (
    isNaN(day)   || isNaN(month) || isNaN(year) ||
    day < 1      || day > 31    ||
    month < 1    || month > 12  ||
    year < 1970  // you can adjust lower bound if you need older dates
  ) {
    return new Date(0, 0, 0)
  }

  // 3. Note: JS Date months are 0‐based, so subtract 1 from month.
  return new Date(year, month - 1, day);
}