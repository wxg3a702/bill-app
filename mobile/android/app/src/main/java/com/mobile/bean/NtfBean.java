package com.mobile.bean;

/**
 * Created by amarsoft on 2016/1/22.
 */
public class NtfBean {
    /**
     * billId : 6
     * category : BILL_SENT
     * content : 安硕公司公司已收苏州银行银行承兑的票据信息：票面金额：1000.0万元、期限：2016年01月05日—2016年01月08日
     * id : 1
     * isRead : true
     * receiveDate : 1452047710000
     * role : drawer
     * title : 受理票据开立
     */

    private int billId;
    private String category;
    private String content;
    private int id;
    private boolean isRead;
    private long receiveDate;
    private String role;
    private String title;

    public void setBillId(int billId) {
        this.billId = billId;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setIsRead(boolean isRead) {
        this.isRead = isRead;
    }

    public void setReceiveDate(long receiveDate) {
        this.receiveDate = receiveDate;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getBillId() {
        return billId;
    }

    public String getCategory() {
        return category;
    }

    public String getContent() {
        return content;
    }

    public int getId() {
        return id;
    }

    public boolean isIsRead() {
        return isRead;
    }

    public long getReceiveDate() {
        return receiveDate;
    }

    public String getRole() {
        return role;
    }

    public String getTitle() {
        return title;
    }
}
