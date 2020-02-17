const formValidations = {
    validations: {
        required: () => value => !value && 'Поле обязательно',
        minLength: length => value => value && value.length < length && `Минимальная длина: ${length} символов`,
        maxLength: length => value => value && value.length > length && `Максимальная длина: ${length} символов`,
        onlyEnglishAndNumbers: () => value => value && !/^\w+$/.test(value) && `Разрешены только a-z, 0-9`,
    },
    add: ({formSelector, fields}) => {
        document.querySelector(formSelector).addEventListener("submit", (event) => {
            event.preventDefault();
            const {target: form} = event,
                linksToField = fields.map(({fieldName}) => fieldName).reduce((acc, currentField) => ({
                    ...acc,
                    [currentField]: form.querySelector(`[name=${currentField}]`)
                }), {});
            let isValid = true;

            fields.forEach(({fieldName, checks}) => {
                const field = linksToField[fieldName],
                    {value} = field,
                    errorsContainer = field.closest('[class$="__container"]').querySelector('.m-errors'),
                    foundErrors = checks.map(check => check(value)).filter(Boolean);

                errorsContainer.innerHTML = '';

                if (foundErrors.length) {
                    isValid = false;
                    const fragment = document.createDocumentFragment();
                    foundErrors.forEach(errorMessage => {
                        const newError = document.createElement('p');
                        newError.textContent = errorMessage;
                        fragment.appendChild(newError)
                    });
                    field.classList.add('invalid');
                    errorsContainer.appendChild(fragment);
                } else {
                    field.classList.remove('invalid');
                }
            });

            if (isValid) {
                /* здесь должен быть код, отправляющий данные */
                form.classList.remove('invalid')
            } else {
                form.classList.add('invalid')
            }
        });
    }
};

formValidations.add({
    formSelector: '.login-form',
    fields: [
        {
            fieldName: 'login',
            checks: [
                formValidations.validations.required(),
                formValidations.validations.minLength(5),
                formValidations.validations.maxLength(10),
                formValidations.validations.onlyEnglishAndNumbers()
            ],
        },
        {
            fieldName: 'password',
            checks: [
                formValidations.validations.required(),
                formValidations.validations.minLength(10),
                formValidations.validations.maxLength(100)
            ]
        }
    ]
});