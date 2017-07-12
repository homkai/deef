/**
 * Created by DOCer on 2017/7/11.
 */

export default {
    namespace: 'test',
    state: {
        isLoading: false,
        tableData: {
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                }, {
                    title: 'Age',
                    dataIndex: 'age',
                }, {
                    title: 'Address',
                    dataIndex: 'address',
                }
            ],
            data: [],
            rowSelection: {
                selectedRowKeys: [3],
            },
            loading: false,
        },
        cascaderData: {
            options: [
                {
                    value: 'zhejiang',
                    label: 'Zhejiang',
                    children: [{
                        value: 'hangzhou',
                        label: 'Hanzhou',
                        children: [{
                            value: 'xihu',
                            label: 'West Lake',
                        }],
                    }],
                },
                {
                    value: 'jiangsu',
                    label: 'Jiangsu',
                    children: [{
                        value: 'nanjing',
                        label: 'Nanjing',
                        children: [{
                              value: 'zhonghuamen',
                              label: 'Zhong Hua Men',
                        }],
                    }],
                },
            ],
        },
        collapseData: {
            text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
        },
        progressData: {
            percent: 0,
        },
    },
    reducers: {
        showLoading(state) {
            return{
                ...state,
                isLoading: true
            }
        },
        hideLoading(state) {
            return{
                ...state,
                isLoading: false
            }
        },
        showTableLoading(state) {
            const tmp  = state.tableData;
            const tableData = {
                ...tmp,
                loading: true
            }
            return {
                ...state,
                tableData
            }
        },
        hideTableLoading(state) {
            const tmp  = state.tableData;
            const tableData = {
                ...tmp,
                loading: false
            }
            return {
                ...state,
                tableData
            }
        },
        setSelectedRowKeys(state, {payload: selected}){
            const tmp  = state.tableData;
            const tmp1 = tmp.rowSelection;
            const rowSelection = {
                ...tmp1,
                selectedRowKeys: selected
            }
            const tableData = {
                ...tmp,
                rowSelection,
            }
            return {
                ...state,
                tableData
            }
        },
        increase(state) {
            const tmp = state.progressData;
            let percent = tmp.percent + 10;
            if (percent > 100) {
                percent = 100;
            }
            const progressData = {
                ...tmp,
                percent
            }            
            return{
                ...state,
                progressData
            }
        },
        decline(state){
            const tmp = state.progressData;
            let percent = tmp.percent - 10;
            if (percent < 0) {
                percent = 0;
            }
            const progressData = {
                ...tmp,
                percent
            }
            return{
                ...state,
                progressData
            }
        },
        mockTableData(state) {
            const data = [];
            for (let i = 0; i < 32; i++) {
                data.push({
                    key: i,
                    name: `Edward King ${i}`,
                    age: 32,
                    address: `London, Park Lane no. ${i}`,
                });
            }
            const tmp = state.tableData;
            const tableData = {
                ...tmp,
                data
            }
            return {
                ...state,
                tableData
            };
        },
    },
};