module.exports = {
    UNAUDITING: {desc: "未提交", color: "red", content: '下一步', button: 'next', colorA: '#ff5b58', alter: '未提交'},
    AUDITING: {desc: "认证中", color: "#ffdc35", content: '返回', button: 'back', colorA: '#ff5b58', alter: '验证中，'},
    REJECTED: {desc: "未通过", color: "#43bb80", content: '下一步', button: 'next', colorA: '#ff5b58', alter: ''},
    CERTIFIED: {desc: "已认证", color: "red", content: '返回', button: 'back', colorA: '#44bcb2', alter: '已通过，'},
    licenseCopyFileId: {
        url: require('../image/company/licenseCopyFileId.png'),
        urlClick: require('../image/company/licenseCopyFileIdClick.png')
    },
    corpIdentityFileId: {
        url: require('../image/company/corpIdentityFileId.png'),
        urlClick: require('../image/company/corpIdentityFileIdClick.png')
    },
    authFileId: {
        url: require('../image/company/authFileIdUnClick.png'),
        urlClick: require('../image/company/authFileIdClick.png')
    },
    authIdentityFileId: {
        url: require('../image/company/authIdentityFileId.png'),
        urlClick: require('../image/company/authIdentityFileIdClick.png')
    }
};