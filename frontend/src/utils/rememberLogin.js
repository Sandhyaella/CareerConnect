const STORAGE_KEY = "cc_remembered_login";

export const getRememberedLogin = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveRememberedLogin = (email, password) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
};

export const clearRememberedLogin = () => {
  localStorage.removeItem(STORAGE_KEY);
};
