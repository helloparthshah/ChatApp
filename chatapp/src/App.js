    import { default as Chatkit } from '@pusher/chatkit-server';
    import React, { Component } from 'react';
    import ChatMessage from './Components/ChatMessage';
    import Signup from './Components/Signup'; 
    import ChatApp from './Components/ChatApp'; 

    const chatkit = new Chatkit({
      instanceLocator: "v1:us1:265b56ac-dab5-4087-95a4-b4d48fe48905",
      key: "e3eda54e-0159-41ca-be03-655b60d75fcf:WucK3ikn48JrfmEqi75T3N5AmvEgv4H5+YlKDSua4K4="
    })
    class App extends Component {
        constructor(props) {
            super(props);
            this.state = {
                currentUsername: '',
                currentId: '',
                currentView: 'signup'
            }
            this.changeView = this.changeView.bind(this);
            this.createUser = this.createUser.bind(this);
        }

        createUser(username) {
            chatkit.createUser({
                id: username,
                name: username,
            })
            .then((currentUser) => {
                this.setState({
                    currentUsername: username,
                    currentId: username,
                    currentView: 'chatApp'
                })
            }).catch((err) => {
                     if(err.status === 400) {
                    this.setState({
                        currentUsername: username,
                        currentId: username,
                        currentView: 'chatApp'
                    })
                } else {
                    console.log(err.status);
                }
            });
        }

      changeView(view) {
          this.setState({
              currentView: view
          })
      }

      render() {
            let view ='';

            if (this.state.currentView === "ChatMessage") {
                view = <ChatMessage  changeView={this.changeView}/>
            } else if (this.state.currentView === "signup") {
                view = <Signup onSubmit={this.createUser}/>
            } else if (this.state.currentView === "chatApp") {
                view = <ChatApp currentId={this.state.currentId} />
            }
            return (
                <div className="App">
                    {view}
                </div>
            );
        }
    }
    export default App;