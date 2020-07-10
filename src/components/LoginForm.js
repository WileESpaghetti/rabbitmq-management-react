import React, { Component } from 'react';

class LoginForm extends React.Component {
    render() {
        return (
            <div id="login">
                <form>
                    <label>
                        Username
                        <input type="text" name="username" />
                    </label>
                    <label>
                        Password
                        <input type="password" name="password"/>
                    </label>
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
}

export default LoginForm;