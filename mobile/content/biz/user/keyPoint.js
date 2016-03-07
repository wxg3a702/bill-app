'use strict';

var React = require('react-native');
var {
    ListView,
    TouchableHighlight,
    Text,
    Dimensions,
    View,
    StyleSheet
    } = React;
var AppStore=require('../../framework/store/appStore');
var NavBarView = require('../../framework/system/navBarView')
var {Icon,} = require('react-native-icons');
var RefreshListView = require('react-native-refreshable-listview')
var PointDetail = require('./pointDetail')
var Message = React.createClass({
    getInitialState: function () {
        return {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            renderList: this.renderLists,
            result: AppStore.getKeyPoint()
        }
    },
    componentDidMount: function () {
        this.fetchData();
    },
    fetchData: function () {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.result),
        });
    },
    detail(item){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                comp: PointDetail,
                param: {
                    title:item.title,
                    content:item.content
                }
            })
        }
    },
    render: function () {

        return (

            <NavBarView navigator={this.props.navigator} title="热点问题" contentBackgroundColor='#f0f0f0'>
                <RefreshListView
                    dataSource={this.state.dataSource}
                    renderRow={this.state.renderList} loadData={this.fetchData}
                    refreshDescription="别着急，正在加载中。。。" automaticallyAdjustContentInsets={false}
                    style={[{backgroundColor: '#f0f0f0', marginTop:18,},styles.borderBottom]}/>
            </NavBarView>

        );
    },
    renderLists: function (item) {
        var {height, width} = Dimensions.get('window');
        return (
            <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc' onPress={()=>this.detail(item)}
                                style={{flexDirection:'column',backgroundColor:'white',}}>
                <View style={[{height:51,justifyContent:'center',},styles.borderBottom]}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginLeft:12,alignItems:'center'}}>
                        <Text numberOfLines={1} style={{fontSize:18,color:'#323232',width:width-50}}>{item.title}</Text>
                        <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC' style={styles.icon}/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
});
var styles = StyleSheet.create({
    borderTop: {
        borderTopWidth: 1,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderColor: '#c8c7cc'
    },
    icon: {
        width: 35, height: 35,
    },
})
module.exports = Message;