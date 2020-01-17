import React, {Component} from 'react';
    import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
    import MessageList from './MessageList';
    import Input from './Input';
    import keys from './keys'

    var name;
    var number;
    var room;

    class ChatApp extends Component {
        constructor(props) {
            super(props); 
            this.state = {
                currentUser: null,
                currentRoom: {users:[]},
                messages: [],
                users: [],
            }
            this.addMessage = this.addMessage.bind(this);
        }

        componentDidMount() {
            const chatManager = new ChatManager({
                instanceLocator: keys.INSTANCE_LOCATOR,
                userId: this.props.currentId,
                tokenProvider: new TokenProvider({
                    url: keys.TOKEN_URL
                })
            })
            chatManager
                .connect()
                .then(currentUser => {
                    this.setState({ currentUser: currentUser })
                    name=currentUser.id
                    return currentUser.subscribeToRoom({
                         roomId: keys.ROOM_ID,
                         messageLimit: 100
                    })
                })
                .then(() =>{
                    number=this.state.currentUser.users.length
                    console.log("Before:"+number)
                    console.log(this.state.currentUser.rooms[0].id)
                    if(isNaN(this.state.currentUser.rooms[0].id)){
                    if(number%2===0){
                        room=number.toString()
                        console.log("Joining1..."+room)
                        return this.state.currentUser.createRoom({
                            id: room,
                            name: room,
                            customData: {
                            isDirectMessage: true,
                            userIds: [name],
                            },
                        });
                    }   
                    else{
                        number=number-1
                        room=number.toString()
                        console.log("Joining2..."+room)
                        return this.state.currentUser.subscribeToRoom({
                            roomId: room,
                            messageLimit: 100,
                        })
                    }
                }
                else{
                    room=this.state.currentUser.rooms[0].id
                    return this.state.currentUser.subscribeToRoom({
                        roomId: room,
                        messageLimit: 100,
                    })
                }
                })
                .then(currentRoom => {
                    this.setState({
                        currentRoom,
                        users: currentRoom.userIds
                    })
                    this.state.currentUser.subscribeToRoom({
                        roomId: room,
                        messageLimit: 100,
                        hooks: {
                            onMessage: message => {
                                this.setState({
                                    messages: [...this.state.messages, message],
                                })
                            },
                        }
                    })
                })
                .catch(error => {
                    console.log(error)
                    window.location.reload(false)
                })
            }

        addMessage(text) {
            this.state.currentUser.sendMessage({
                text,
                roomId: this.state.currentRoom.id
            })
            .catch(error => console.error('error', error));
        }
        
        render() {
            return (
                <div>
                    <h2 className="header">Hey there, {name}!</h2>
                    <div className="test"><MessageList messages={this.state.messages} /></div>
                    <Input className="input-field" onSubmit={this.addMessage} />
                </div>
            )
        }
    }
    export default ChatApp;