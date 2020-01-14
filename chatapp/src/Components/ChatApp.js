import React, {Component} from 'react';
    import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
    import MessageList from './MessageList';
    import Input from './Input';

    var name;
    var number;

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
                instanceLocator: 'v1:us1:265b56ac-dab5-4087-95a4-b4d48fe48905',
                userId: this.props.currentId,
                tokenProvider: new TokenProvider({
                    url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/265b56ac-dab5-4087-95a4-b4d48fe48905/token'
                })
            })
            chatManager
                .connect()
                .then(currentUser => {
                    this.setState({ currentUser: currentUser })
                    name=currentUser.id
                    return currentUser.subscribeToRoom({
                        roomId: "8e7737c0-354f-4416-bd82-b3b4ef1e3aa4",
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
                .then(currentRoom => {
                    number=Math.floor(this.state.currentUser.users.length/2)+1
                    /* alert("You have been aloted: "+number) */
                    this.setState({
                        currentRoom,
                        users: currentRoom.userIds
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