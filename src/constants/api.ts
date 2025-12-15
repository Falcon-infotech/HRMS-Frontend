import moment from "moment-timezone";

// old one
// export const BASE_URL = 'https://hrms-backend-fork-1.onrender.com';


// for development
export const BASE_URL = 'http://koc4k40848g84k4cg8ook4oc.43.204.178.166.sslip.io';



// fro production
// export const BASE_URL = 'https://hrms-backend-yrrr.onrender.com';

//latest
// export const BASE_URL = 'https://my-app-production-1884.up.railway.app';

//aws

// export const BASE_URL = 'https://hrms-backend.falconinfotech.co';




export const API = {
    LOGIN: `${BASE_URL}/api/auth/login`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    REGISTER: `${BASE_URL}/api/auth/register`,
}



export function timeZone(timeZone: string) {
    const now = moment().tz(timeZone);
    const abbreviation = now.format("z")
    return abbreviation
}

export const formatDate = (d?: string | null) => {
  if (!d) return ''
  try {
    return new Date(d).toISOString().split('T')[0]
  } catch {
    return ''
  }
}




