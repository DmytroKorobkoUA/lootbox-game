export const validateCredentials = (username, password) => {
    if (!username.trim()) {
        return 'Username cannot be empty.';
    }
    if (!password.trim()) {
        return 'Password cannot be empty.';
    }
    if (password.length < 5) {
        return 'Password must be at least 5 characters long.';
    }
    return '';
};
