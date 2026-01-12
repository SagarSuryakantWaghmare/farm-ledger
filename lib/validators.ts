export const validatePin = (pin: string): { valid: boolean; error?: string } => {
    if (!pin) {
        return { valid: false, error: 'PIN is required' };
    }

    if (!/^\d{4}$/.test(pin)) {
        return { valid: false, error: 'PIN must be exactly 4 digits' };
    }

    return { valid: true };
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
    if (!email) {
        return { valid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true };
};

export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
    if (!phone) {
        return { valid: false, error: 'Phone number is required' };
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        return { valid: false, error: 'Phone must be 10 digits' };
    }

    return { valid: true };
};

export const validateAmount = (amount: number): { valid: boolean; error?: string } => {
    if (amount === undefined || amount === null) {
        return { valid: false, error: 'Amount is required' };
    }

    if (amount <= 0) {
        return { valid: false, error: 'Amount must be greater than 0' };
    }

    return { valid: true };
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Only JPG, PNG, and WEBP images are allowed' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'Image size must be less than 5MB' };
    }

    return { valid: true };
};
