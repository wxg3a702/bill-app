module.exports = {
    rev: {
        '': {desc: '全部'},
        NEW: {desc: '新票据', pic: require('../../image/bill/payee_new.png')},
        REQ: {desc: '已申请', pic: require('../../image/bill/payee_req.png')},
        HAN: {desc: '受理中', pic: require('../../image/bill/payee_han.png')},
        DIS: {desc: '已贴现', pic: require('../../image/bill/payee_dis.png')},
        IGN: {desc: '不贴现', pic: require('../../image/bill/payee_ign.png')},
    },
    sent: {
        '': {desc: '全部'},
        NEW: {desc: '等待中', pic: require('../../image/bill/drawer_wait.png')},
        REQ: {desc: '等待中', pic: require('../../image/bill/drawer_wait.png')},
        HAN: {desc: '等待中', pic: require('../../image/bill/drawer_wait.png')},
        DIS: {desc: '已贴现', pic: require('../../image/bill/drawer_dis.png')},
        IGN: {desc: '不贴现', pic: require('../../image/bill/drawer_ign.png')},
    },
};