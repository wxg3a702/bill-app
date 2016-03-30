describe('util', function () {
    it('listToJson', function () {
        var a = [
            {
                accountName: "苏州万达二期",
                accountNo: "6217856122221111888",
                certResultBeans: null
            }
            ,
            {
                accountName: "苏州万达二期",
                accountNo: "6217856122221111888",
                certResultBeans: [
                    {
                        "columnName": "LICENSE_COPY_FILE_ID",
                        "resultCode": "NOT_RECOGNIZE",
                        "resultValue": "图片不可辨认",
                        "resultDesc": null
                    }, {
                        "columnName": "AUTH_FILE_ID",
                        "resultCode": "NOT_REQUIRE",
                        "resultValue": "图片内容和要求不符合",
                        "resultDesc": null
                    }, {
                        "columnName": "CORP_IDENTITY_FILE_ID",
                        "resultCode": "NOT_ACCORD",
                        "resultValue": "图片内容和其它材料不统一",
                        "resultDesc": null
                    }, {
                        "columnName": "AUTH_IDENTITY_FILE_ID",
                        "resultValue": "其它",
                        "resultDesc": "图片不全"
                    }, {
                        "columnName": "BANK_ACCOUNT_NO",
                        "resultCode": "BANK_ACC_INCORRECT",
                        "resultValue": "银行账户有误",
                        "resultDesc": null
                    }
                ]
            }
        ]
        var json = {};
        a.map((item)=> {
            if (!item.certResultBeans) {
            } else {
                item.certResultBeans.map((items)=> {
                    json[items.columnName] = items
                })
                item.certResultBeans = json
            }

        })

        if(!a[1].certResultBeans['LICENSE_COPY_FILE_ID']){
        }else{
        }
        a[1].certResultBeans

        delete(a[1].certResultBeans['LICENSE_COPY_FILE_ID'])
    })
})