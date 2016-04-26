'use strict'
var React = require('react-native');
var {
    ListView,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    TextInput,
    Dimensions,
    Platform
} = React;

var NavBarView = require('../../framework/system/navBarView');
var BillStore = require('../../framework/store/billStore');
var numeral = require('numeral');
var Alert = require('../../comp/utils/alert');

var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

var SelextBank = React.createClass({
    getInitialState: function () {

        var acceptanceBankBeans = BillStore.getAcceptanceBankBeans();
        if (acceptanceBankBeans == null){
            acceptanceBankBeans = "";
        }

        return {
            dataSource: ds.cloneWithRows(acceptanceBankBeans),
            acceptanceBankBeans: acceptanceBankBeans,
        };
    },
    render: function () {
        var {height, width} = Dimensions.get('window');
        return (
            <NavBarView navigator={this.props.navigator}
                        title="选择贴现行">
                {this._renderSearchBar()}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                />

            </NavBarView>
        );
    },
    _renderSearchBar(){
        return (
            <View style={{height:40,backgroundColor:'#7f7f7f'}}>
                <View
                    style={{height:30,backgroundColor:'#fff',marginTop:5,marginLeft:10,marginRight:10,borderRadius:4}}>
                    <TextInput
                        placeholder={'搜索'}
                        onChangeText={(text) => this.textChange(text)}
                        returnKeyType={'search'}
                        onEndEditing={(text) => this.textEditing(text)}
                        style={{height:(Platform.OS === 'ios')?30:60,backgroundColor:'#fff',marginTop:(Platform.OS === 'ios')?0:-15,marginLeft:10,marginRight:10}}></TextInput>
                </View>
            </View>
        );
    },
    textChange(text){
        var ret = new Array();

        if (this.state.acceptanceBankBeans == null || this.state.acceptanceBankBeans == ""){

        }else {
            if (!text) {
                ret = this.state.acceptanceBankBeans
            } else {
                this.state.acceptanceBankBeans.map((item, index)=> {
                    if (item.bankName.indexOf(text) >= 0) {
                        ret.push(item)
                    }
                })
            }
        }
        this.setState({dataSource: ds.cloneWithRows(ret)})
    },

    textEditing(text){

        if(this.state.dataSource.length == 0){
            Alert('未搜索到结果');
        }
    },

    select(item){
        this.props.callback(item);
        this.props.navigator.pop();
    },

    _renderRow(rowData, sectionId, rowId){
        return (
            <TouchableOpacity underlayColor='#ebf1f2' onPress={()=>this.select(rowData)}
                              style={{flex:1}}>
                <View
                    style={{height:50,backgroundColor:'#fff',flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomColor:'#e0e0e0',borderBottomWidth:1}}>
                    <Text style={{marginLeft:16,color:'#333333',fontSize:18}}>{rowData.bankName}</Text>

                    {rowId == 0 ? <Text style={{color:'#ff5b58',fontSize:18}}>(费率最低)</Text> : <Text></Text>}

                    <Text
                        style={{marginRight:16,color:'#7f7f7f',fontSize:15}}>{numeral(rowData.discountRate * 1000).format("0,0.00") + '‰'}</Text>
                </View>
            </TouchableOpacity>
        );
    }

});

var styles = StyleSheet.create({});

module.exports = SelextBank;