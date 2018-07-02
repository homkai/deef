const importTitleDialog = {
    isOpen: false,
    listData: [],
    searchQuery: '',
    isRequesting: true
};

const formData = {
    title: '',
    url: ''
};

const initialState = {
    formData,
    importTitleDialog
};

export default {
    namespace: 'ideaEditor',
    state: initialState,
    reducers: {
        changeFormField(state, {payload: {field, value}}) {
            return {
                ...state,
                formData: {
                    ...state.formData,
                    [field]: value
                }

            };
        },
        resetFormData(state) {
            return {
                ...state,
                formData
            };
        },
        changeImportTitleDialog(state, {payload: importTitleDialog}) {
            return {
                ...state,
                importTitleDialog: {
                    ...state.importTitleDialog,
                    ...importTitleDialog
                }
            };
        },
        resetImportTitleDialog(state) {
            return {
                ...state,
                importTitleDialog
            };
        }
    }
};
