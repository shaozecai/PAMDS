export function validEmail(val: string) {
  return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val);
}

export function validPhone(val: string) {
  return /^1[3456789]\d{9}$/.test(val);
}

export function validPass(val: string) {
  return /^[a-zA-Z\d]{8,20}$/.test(val);
  // return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(val);
  // return /^.{6,16}$/.test(val);
}

export function validUserName(name: string) {
  return validEmail(name) || validPhone(name);
}

export function validCode(val: string) {
  return /^[0-9]{6}$/.test(val);
}

export function userName(str: string) {
  const re = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
  return re.test(str);
}

export function validateMainName2(name: string) {
  const re = /^[a-zA-Z0-9_-]{1,19}$/
  return re.test(name);
}

export function validateNickName(name: string) {
  const re = /^[a-zA-Z0-9\u4E00-\u9FA5]{2,10}$/
  return re.test(name);
}

export function formatDate(value: string) {
  if (!value) {
    return '';
  }
  const d = new Date(value);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
  const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
  return  year + '-' + month + '-' + day;
}

export function formatTime(value: string) {
  if (!value) {
    return '';
  }
  const d = new Date(value);
  const month = d.getMonth() + 1;
  const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
  const hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
  return  month + '月' + day + '日' + ' ' + hour + '时';
}

export function formatHour(value: string) {
  if (!value) {
    return '';
  }
  const d = new Date(value);
  const hour = d.getHours();
  return  hour;
}



export default {
  validEmail,
  validPhone,
  validUserName,
  validCode,
  validPass,
  userName,
  validateMainName2,
  validateNickName,
  formatDate,
  formatHour
}
