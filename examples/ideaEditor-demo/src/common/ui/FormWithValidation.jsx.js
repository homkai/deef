import React from 'react';
import _  from 'lodash';
import {Form} from 'fcui2';

class FormWithValidation extends React.Component {
    constructor(...args) {
        super(...args);

        this.onFieldChange = this.onFieldChange.bind(this);
    }
    onFieldChange(form) {
        this.props.onFieldChange(form);
        const validationResults = form.validationResults;
        const fieldErrors = {};
        const errorMessageList = [];
        const separator = this.props.separator;
        _.forEach(validationResults, (val, name) => {
            if (!val.length) {
                return;
            }
            fieldErrors[name] = val[0];
            val.map(item => errorMessageList.push(name + separator + item));
        });
        const errorMessage = errorMessageList.length ? errorMessageList : null;
        if (form.field) {
            this.props.onFieldValidate(fieldErrors, form);
        }
        else {
            this.props.onSubmitValidate(errorMessage, validationResults, form);
        }
    }
    render() {
        const props = this.props;
        const formProps = {
            ...props,
            onFieldChange: this.onFieldChange,
            onSubmit: props.onSubmit
        };
        return (<Form {...formProps}>{props.children}</Form>);
    }
}

FormWithValidation.defaultProps = {
    separator: '：',
    onFieldValidate: _.noop,
    onSubmitValidate: _.noop,
    onFieldChange: _.noop
};

export default FormWithValidation;