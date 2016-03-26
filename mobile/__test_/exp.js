describe('util', function () {
    it('delete list item', function () {
        var list = JSON.parse('[{"columnName":"LICENSE_COPY_FILE_ID","resultCode":"NOT_RECOGNIZE","resultValue":"图片不可辨认","resultDesc":null},{"columnName":"AUTH_FILE_ID","resultCode":"NOT_REQUIRE","resultValue":"图片内容和要求不符合","resultDesc":null},{"columnName":"CORP_IDENTITY_FILE_ID","resultCode":"NOT_ACCORD","resultValue":"图片内容和其它材料不统一","resultDesc":null},{"columnName":"AUTH_IDENTITY_FILE_ID","resultCode":"OTHER","resultValue":"其它","resultDesc":"图片不全"},{"columnName":"BANK_ACCOUNT_NO","resultCode":"BANK_ACC_INCORRECT","resultValue":"银行账户有误","resultDesc":null}]')
        var json ={}
        list.map((item)=>{json[item.columnName]=item});
        delete json["LICENSE_COPY_FILE_ID"];
        var item =json['LICENSE_COPY_FILE_ID']
    });


});