'use strict';
var React = require('react-native')
var {
    View,
    ListView,
    Text,
    StyleSheet
    }=React
var Adjust=require('../../comp/utils/adjust')
var NavBarView = require('../../framework/system/navBarView');
var BillStates = require('./../../constants/billStates');
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var BillContent = React.createClass({
    getInitialState(){
        let item = !this.props.param.item ? this.props.param : this.props.param.item
        return {
            item: item,
            dataSource: BillStates.content
        }
    },
    renderRow(data){
        return (
            <View style={{flexDirection:'row',alignItems:'center',paddingVertical:8}}>

                <Text style={{fontSize:16,color:'#333333',flex:1}}>
                    {data.desc}
                </Text>

                <Text style={{fontSize:16,color:'#7f7f7f',width:Adjust.width(235)}}
                      numberOfLines={2}
                >
                    {!data.deal ? this.state.item[data.key] : data.deal(this.state.item[data.key]) + (data.unit ? '万元' : '')}
                </Text>

            </View>
        )
    },
    returnList(){
        return (
            <View style={{paddingTop:4,backgroundColor:'white'}}>
                <ListView dataSource={ds.cloneWithRows(this.state.dataSource)} renderRow={this.renderRow}
                          automaticallyAdjustContentInsets={false} style={styles.bottom}/>
            </View>
        )
    },
    returnNeedTitle(){
        if (this.props.needTitle == false) {
            return (
                <View>
                    {this.returnList()}
                </View>
            )
        } else {
            return (
                <NavBarView navigator={this.props.navigator} title="票据详情" contentBackgroundColor='#f0f0f0'>
                    {this.returnList()}
                </NavBarView>
            )
        }
    },
    render(){
        return (
            <View>
                {this.returnNeedTitle()}
            </View>
        )
    }
})
var styles = StyleSheet.create({
    bottom: {
        borderBottomWidth: 1,
        borderColor: '#c8c8c8',
        paddingHorizontal: 12
    }
})
module.exports = BillContent