'use strict';
var React = require('react-native');
var {
    PushNotificationIOS,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    } = React;
var Alert = require('../../comp/utils/alert');
var Button = React.createClass({
    render: function () {
        return (
            <TouchableHighlight
                underlayColor={'white'}
                style={styles.button}
                onPress={this.props.onPress}>
                <Text style={styles.buttonLabel}>
                    {this.props.label}
                </Text>
            </TouchableHighlight>
        );
    }
});

class NotificationExample extends React.Component {

    componentWillMount() {
        PushNotificationIOS.addEventListener('notification', this._onNotification);
    }

    componentWillUnmount() {
        PushNotificationIOS.removeEventListener('notification', this._onNotification);
    }

    render() {
        PushNotificationIOS.requestPermissions();
        PushNotificationIOS.addEventListener('register', function (token) {
            console.log('You are registered and the device token is: ', token)
        });
        return (
            <View>
                <Button
                    onPress={this._sendNotification}
                    label="Send fake notification"
                />
            </View>
        );
    }

    _sendNotification() {
        require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
            aps: {
                alert: 'Sample notification',
                badge: '+1',
                sound: 'default',
                category: 'REACT_NATIVE'
            },
        });
    }

    _onNotification(notification) {
        Alert(
            'Notification Received',
            'Alert message: ' + notification.getMessage(),
            [{
                text: 'Dismiss',
                onPress: null,
            }]
        );
    }
}

class NotificationPermissionExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {permissions: null};
    }

    render() {
        return (
            <View>
                <Button
                    onPress={this._showPermissions.bind(this)}
                    label="Show enabled permissions"
                />
                <Text>
                    {JSON.stringify(this.state.permissions)}
                </Text>
            </View>
        );
    }

    _showPermissions() {
        PushNotificationIOS.checkPermissions((permissions) => {
            this.setState({permissions});
        });
    }
}

var styles = StyleSheet.create({
    button: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLabel: {
        color: 'blue',
    },
});
exports.main = NotificationExample;
exports.title = 'PushNotificationIOS';
exports.description = 'Apple PushNotification and badge value';
exports.examples = [
    {
        title: 'Badge Number',
        render(): React.Component {
            PushNotificationIOS.requestPermissions();
            return (
                <View>
                    <Button
                        onPress={() => PushNotificationIOS.setApplicationIconBadgeNumber(42)}
                        label="Set app's icon badge to 42"
                    />
                    <Button
                        onPress={() => PushNotificationIOS.setApplicationIconBadgeNumber(0)}
                        label="Clear app's icon badge"
                    />
                </View>
            );
        },
    },
    {
        title: 'Push Notifications',
        render(): React.Component {
            return <NotificationExample />;
        }
    },
    {
        title: 'Notifications Permissions',
        render(): React.Component {
            return <NotificationPermissionExample />;
        }
    }];