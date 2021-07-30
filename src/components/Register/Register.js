import React from 'react';

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        }
    }
    
    
    onNameChange = (event) => {
        this.setState({name: event.target.value})
    }
    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    }
    onPasswordChange = (event) => {
        this.setState({password: event.target.value})
    }
    enterKey = (event) =>{
         if (event.key === 'Enter') {
          this.onSubmitRegister();
    }}
    onSubmitRegister =(event) => {
           event.preventDefault();
           const { target } = event;
           if (
             !this.state.name ||
             !this.state.email ||
             !this.state.password
             ) {
               alert("Please enter the given fields");
               return;
              }
              this.props.onSetLoading(true);
           target.disabled = true;
       fetch("https://nameless-retreat-80613.herokuapp.com/register", {
         method: "post",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           email: this.state.email,
           password: this.state.password,
           name: this.state.name,
         }),
       })
         .then((response) => {
           return response.json();
         })
         .then((user) => {
           if (user.userId) {
             this.props.saveAuthToken(user.token);
             this.props.getUserProfile(user.userId);
           } else {
               this.props.onSetLoading(false);
             alert("Please enter the given fields");
           }
         })
         .catch((err) => {
             this.props.onSetLoading(false);

             alert("error in registering")
            });
             this.props.onSetLoading(false);

            target.disabled = false;
        
    }

    render() {
    return (
      <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure ">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input
                  autocomplete="off"
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                  onChange={this.onNameChange}
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  autocomplete="off"
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>

              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                  onKeyPress={this.enterKey}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onKeyPress={this.enterKey}
                onClick={this.onSubmitRegister}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Register"
              />
            </div>
          </div>
        </main>
      </article>
    );
    }
}

export default Register; 