// Hàm lưu code vào localStorage
export const saveCode = (code: string) => {
  try {
    localStorage.setItem("code", code);
    return true;
  } catch (error) {
    console.error("Error saving code:", error);
    return false;
  }
};

// Hàm lấy code từ localStorage
export const loadCode = (algorithmId: string): string | null => {
  try {
    return localStorage.getItem(`algorithm_${algorithmId}`);
  } catch (error) {
    console.error("Error loading code:", error);
    return null;
  }
};

// Hàm tạo URL chia sẻ code
export const generateShareableUrl = (code: string): string => {
  const encodedCode = encodeURIComponent(code);
  return `${window.location.origin}${window.location.pathname}?code=${encodedCode}`;
};

// Hàm lấy code từ URL
export const getCodeFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  return code ? decodeURIComponent(code) : null;
};
