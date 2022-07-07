/* eslint-disable max-len */
/* eslint-disable no-plusplus */
function getAge(dob) {
  const date = dob.getDate();
  const month = dob.getMonth();
  const year = dob.getFullYear();
  const presentdate = new Date();
  let age = presentdate.getFullYear() - year;
  if (presentdate.getMonth() - month < 0) { age--; } else if (+presentdate.getMonth() - month === 0 && +presentdate.getDate() - date < 0) { age--; }
  return age;
}
module.exports = getAge;
