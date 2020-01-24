import React, {Component} from 'react';

class  Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({username: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault()
        this.props.onSubmit(this.state.username);
    }
    render() {
        return(
            <div className="form-container">
                <h1>Let's Talk</h1>
                <form onSubmit={this.handleSubmit} className="form">
                    <label htmlFor="name">What is your name?</label>
                    <input type="name" name="username" onChange={this.handleChange} className="input" />
                    <button className="submit">Submit</button>
                </form>
                <center>
                <div style={{textAlign:"center",border: '3px solid',width:'55%',borderRadius:'30px'}}>
                    <h2>If you reload the page please login with the same username as before!</h2>
                </div></center>
            </div>
        )
    }
}
export default Signup;