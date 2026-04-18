export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6; // Minimum password length
};

export const validateRequired = (value: string): boolean => {
    return value.trim() !== '';
};

export const validateTaskTitle = (title: string): boolean => {
    return title.length > 0 && title.length <= 100; // Title must be between 1 and 100 characters
};

export const validateProjectName = (name: string): boolean => {
    return name.length > 0 && name.length <= 50; // Project name must be between 1 and 50 characters
};