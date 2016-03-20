'use strict'
var React = require('react-native')
var {
    View,
    TextInput,
    StyleSheet,
    Platform
    }=React
var SearchBar = React.createClass({
    textChange(text){
        this.props.onChange(text)
    },
    render(){
        return (
            <View style={{height:40,backgroundColor:'#7f7f7f'}}>
                <View style={styles.search}>
                    <TextInput placeholder='搜索' returnKeyType='search' style={styles.input}
                               onChangeText={(text) => this.textChange(text)}/>
                </View>
            </View>
        )
    }
})
var styles = StyleSheet.create({
    search: {
        height: 30, backgroundColor: '#fff', marginTop: 5, marginLeft: 10, marginRight: 10, borderRadius: 4
    },
    input: {
        height: (Platform.OS === 'ios') ? 30 : 60,
        backgroundColor: '#fff',
        marginTop: (Platform.OS === 'ios') ? 0 : -15,
        marginLeft: 10,
        marginRight: 10
    }
})
module.exports = SearchBar