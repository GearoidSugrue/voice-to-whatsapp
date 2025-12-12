const apiUrlEnv = import.meta.env.VITE_API_URL

export const apiBaseUrl = apiUrlEnv ? apiUrlEnv.replace(/\/+$/, '') : ''
