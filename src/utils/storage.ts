export const setItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return { error: false };
  } catch (error) {
    return { error: true };
  }
};

export const getItem = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    if (value !== null) {
      const parsedData = JSON.parse(value);
      return { data: parsedData };
    }
    return { data: "", error: !value ? true : false };
  } catch (error) {
    return { data: null, error: true };
  }
};

export const removeItem = (key: string) => {
  try {
    localStorage.removeItem(key);
    return { error: false };
  } catch (error) {
    return { error: true };
  }
};

export const removeAll = () => {
  try {
    localStorage.clear();
    return { error: false };
  } catch (error) {
    return { error: true };
  }
};
