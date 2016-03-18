/**
 * Created by cui on 16/3/15.
 */
/**
 * Created by cui on 16/3/10.
 */
var React = require('react-native');
var {
    AppRegistry,
    Image,
    ListView,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Text,
    View,
    TextInput,
    ScrollView,
    Dimensions,
    Platform
    } = React;

var NavBarView = require('../../framework/system/navBarView');

var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

var Model = [
    {
        id: '1',
        bankName: '汉口银行',
        disRate: 99.99
    },
    {
        id: '2',
        bankName: '湖北省农村信用社',
        disRate: 99.99
    },
    {
        id: '3',
        bankName: '湖北银行',
        disRate: 99.99
    },
]

var SelextBank = React.createClass({
    getInitialState: function () {
        return {
            dataSource: ds.cloneWithRows(Model),
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
            //<SearchBar placeholder='Search'
            //           textFieldBackgroundColor='white'>
            //</SearchBar>
            <View style={{height:40,backgroundColor:'#7f7f7f'}}>
                <View
                    style={{height:30,backgroundColor:'#fff',marginTop:5,marginLeft:10,marginRight:10,borderRadius:4}}>
                    <TextInput
                        placeholder={'搜索'}
                        onChangeText={(text) => this.textChange(text)}
                        returnKeyType={'search'}
                        style={{height:(Platform.OS === 'ios')?30:60,backgroundColor:'#fff',marginTop:(Platform.OS === 'ios')?0:-15,marginLeft:10,marginRight:10}}></TextInput>
                </View>
            </View>
        );
    },
    textChange(text){
        var ret = new Array();
        if (!text) {
            ret = Model
        } else {
            Model.map((item, index)=> {
                if (item.bankName.indexOf(text) >= 0) {
                    ret.push(item)
                }
            })
        }
        this.setState({dataSource: ds.cloneWithRows(ret)})
    },
    select(item){
        this.props.callback(item);
        this.props.navigator.pop();
    },
    _renderRow(item){
        return (
            <TouchableOpacity underlayColor='#ebf1f2' onPress={()=>this.select(item)}
                              style={{flex:1}}>
                <View
                    style={{height:50,backgroundColor:'#fff',flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderBottomColor:'#e0e0e0',borderBottomWidth:1}}>
                    <Text style={{marginLeft:16,color:'#333333',fontSize:18}}>{item.bankName}</Text>
                    <Text style={{marginRight:16,color:'#7f7f7f',fontSize:15}}>{item.disRate+'‰'}</Text>
                </View>
            </TouchableOpacity>
        );
    }

});

var styles = StyleSheet.create({});

module.exports = SelextBank;