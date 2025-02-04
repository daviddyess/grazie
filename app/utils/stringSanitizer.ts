/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
/**
 * Based on: 
The MIT License (MIT)
Copyright (c) Md. Fazlul Karim <fazlulkarimrocky@gmail.com> (http://twitter.com/fazlulkarimweb)
https://github.com/fazlulkarimweb/string-sanitizer
 */

export function sanitizer(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

export const sanitize = {
  keepUnicode: (str) => {
    return str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  },
  keepSpace: (str) => {
    var str2 = str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return str2.replace(/ /g, ' ');
  },
  addFullstop: (str) => {
    var str2 = str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return str2.replace(/ /g, '.');
  },
  addUnderscore: (str) => {
    var str2 = str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return str2.replace(/ /g, '_');
  },
  addDash: (str) => {
    var str2 = str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return str2.replace(/ /g, '-');
  },
  removeNumber: (str) => {
    return str.replace(/[^a-zA-Z]/g, '');
  },
  removeText: (str) => {
    return str.replace(/[^0-9]/g, '');
  },
  keepNumber: (str) => {
    return str.replace(/[^a-zA-Z0-9]/g, '');
  }
};

export function addFullstop(str) {
  return str.replace(/ /g, '.');
}
export function addUnderscore(str) {
  return str.replace(/ /g, '_');
}

export function addDash(str) {
  return str.replace(/ /g, '-');
}

// Remove Space without sanitizing
export function removeSpace(str) {
  return str.replace(/\s+/g, '');
}

export function removeUnderscore(str) {
  return str.replace(/_+/g, '');
}

export const validate = {
  isEmail: (str) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(str)) {
      return str;
    } else {
      return false;
    }
  },
  isUsername: (str) => {
    const regex = /^[a-z][a-z]+\d*$|^[a-z]\d{2,}$/i;
    if (regex.test(str)) {
      return str.toLowerCase();
    } else {
      return false;
    }
  },
  isPassword6to15: (str) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$/;
    if (regex.test(str)) {
      return str;
    } else {
      return false;
    }
  },
  isPassword7to20: (str) => {
    const regex = /^[A-Za-z]\w{7,20}$/;
    if (regex.test(str)) {
      return str;
    } else {
      return false;
    }
  },
  isPassword6to20: (str) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (regex.test(str)) {
      return str;
    } else {
      return false;
    }
  },
  isPassword8to15: (str) => {
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (regex.test(str)) {
      return str;
    } else {
      return false;
    }
  }
};
