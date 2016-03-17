module.exports = {
    rev: {
        '': {desc: '全部'},
        NEW: {
            desc: '新票据', pic: require('../../image/bill/payee_new.png'), color: '#ff5b58',
            content: '票面金额', key: 'amount', value: 'dateC', button: '我要贴现'
        },
        REQ: {
            desc: '已申请', pic: require('../../image/bill/payee_req.png'), color: '#FEB923',
            content: '参考贴现金额', key: 'will', value: '点击查看票据详情', button: '撤销申请'
        },
        HAN: {
            desc: '受理中', pic: require('../../image/bill/payee_han.png'), color: '#438CEC',
            content: '参考贴现金额', key: 'will', value: '点击查看票据详情', button: '返回'
        },
        DIS: {
            desc: '已贴现', pic: require('../../image/bill/payee_dis.png'), color: '#44bcb2',
            content: '贴现金额', key: 'dis', value: '点击查看票据详情', button: '返回'
        },
        IGN: {
            desc: '不贴现', pic: require('../../image/bill/payee_ign.png'), color: '#96a5b8',
            content: '票面金额', key: 'amount', value: '点击查看票据详情', button: '返回'
        },
    },
    sent: {
        '': {desc: '全部'},
        NEW: {
            desc: '等待中', pic: require('../../image/bill/drawer_wait.png'), color: '#96a5b8',
            content: '票面金额', key: 'amount', value: '请等待承兑行出票', button: '返回'
        },
        REQ: {
            desc: '等待中', pic: require('../../image/bill/drawer_wait.png'), color: '#96a5b8',
            content: '票面金额', key: 'amount', value: '请等待承兑行出票', button: '返回'
        },
        HAN: {
            desc: '等待中', pic: require('../../image/bill/drawer_wait.png'), color: '#96a5b8',
            content: '票面金额', key: 'amount', value: '请等待承兑行出票', button: '返回'
        },
        DIS: {
            desc: '已贴现', pic: require('../../image/bill/drawer_dis.png'), color: '#44bcb2',
            content: '票面金额', key: 'amount', value: 'dateT', button: '返回'
        },
        IGN: {
            desc: '不贴现', pic: require('../../image/bill/drawer_ign.png'), color: '#ff5b58',
            content: '票面金额', key: 'amount', value: '请至承兑行取票', button: '返回'
        },
    },
};