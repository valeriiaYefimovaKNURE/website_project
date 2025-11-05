class Field {
    constructor(value) {
        this.value = (value || "").trim(); // Обработка undefined или null
    }

    validate() {
        return { valid: true, message: "" };
    }
}

class NameField extends Field {
    validate() {
        if (!this.value) {
            return { valid: false, message: "Ім'я не має бути порожнім" };
        } else if (this.value.length > 25) {
            return { valid: false, message: "Ім'я повинно містити менше 25 символів" };
        }
        return { valid: true, message: "" };
    }
}
class LoginField extends Field {
    validate() {
        if (!this.value) {
            return { valid: false, message: "Введіть логін" };
        } else if (!/^[a-zA-Z0-9._]+$/.test(this.value)) {
            return { valid: false, message: "Логін має містити тільки латиницю, цифри, крапки та нижнє підкреслення (_)" };
        }
        return { valid: true, message: "" };
    }
}
class EmailField extends Field {
    validate() {
        if (!this.value) {
            return { valid: false, message: "Введіть електронну адресу." };
        } else if (!/^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]+$/.test(this.value)) {
            return { valid: false, message: "Введіть пошту в форматі: example@domain.com" };
        }
        return { valid: true, message: "" };
    }
}

class PasswordField extends Field {
    validate() {
        if (!this.value) {
            return { valid: false, message: "Введіть пароль." };
        } else if (this.value.length < 6) {
            return { valid: false, message: "Пароль має містити більше 5 символів" };
        }
        return { valid: true, message: "" };
    }
}

export { NameField, LoginField, EmailField, PasswordField };

export const validateForm = (form) => {
    const fields = {
        name: new NameField(form.name),
        login: new LoginField(form.login),
        email: new EmailField(form.email),
        password: new PasswordField(form.password)
    };

    for (const field in fields) {
        if (fields.hasOwnProperty(field)) {
            const validation = fields[field].validate();
            if (!validation.valid) {
                return validation;
            }
        }
    }

    return { valid: true, message: "" };
};

export const validateLoginForm = (form) => {
    const fields = {
      email: new EmailField(form.email),
      password: new PasswordField(form.password)
    };

    for (const field in fields) {
      if (fields.hasOwnProperty(field)) {
        const validation = fields[field].validate();
        if (!validation.valid) {
          return validation;
        }
      }
    }

    return { valid: true, message: "" };
};