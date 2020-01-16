import React, {Component} from 'react';
    import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
    import MessageList from './MessageList';
    import Input from './Input';

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
                instanceLocator: 'v1:us1:367c69d6-7186-46ee-97bb-f87cbbbecd17',
                userId: this.props.currentId,
                tokenProvider: new TokenProvider({
                    url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/367c69d6-7186-46ee-97bb-f87cbbbecd17/token'
                })
            })
            alert("Wait!")
            chatManager
                .connect()
                .then(currentUser => {
                    this.setState({ currentUser: currentUser })
                    name=currentUser.id
                    return currentUser.subscribeToRoom({
                         roomId: "cff88da4-9924-4f8e-9d87-5dd020c08798",
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
                .then(() =>{
                    number=this.state.currentUser.users.length
                    console.log("Before:"+number)
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
                    });}
                    else{
                        number=number-1
                    room=number.toString()
                    console.log("Joining2..."+room)
                        return this.state.currentUser.subscribeToRoom({
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
                .catch(error => console.log(error))
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
                    <h2 className="header">Hey there, {name}! You have been alloted {number}</h2>
                    <div className="test"><MessageList messages={this.state.messages} /></div>
                    <Input className="input-field" onSubmit={this.addMessage} />
                </div>
            )
        }
    }
    export default ChatApp;