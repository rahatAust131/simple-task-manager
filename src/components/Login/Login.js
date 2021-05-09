import React, { useContext, useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import './Login.css';
import firebaseConfig from './firebase.config';
import { useForm } from "react-hook-form";
import { UserContext } from '../../App';

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const Login = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    // form submit handler
    const onSubmit = data => {
        const { email, password, firstName, lastName } = data;
        const customUser = {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        };
        !isSignedIn ? signUpWithEmailAndPassword(customUser) : signInWithEmailAndPassword(customUser);
    };

    // sign up method (for new user)
    const signUpWithEmailAndPassword = (user) => {
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(() => {
                const newUser = { ...user };
                console.log("user created successfully ", newUser);
                setLoggedInUser(newUser);
                setIsSignedIn(true);
                console.log("logged in user info", loggedInUser);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };

    // sign in method (if already have an account)
    const signInWithEmailAndPassword = (user) => {
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then((userCredential) => {
                const newUser = { ...user };
                console.log('user signed in successfully', newUser);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("error code ", errorCode, "error message", errorMessage);
            });
    }

    return (
        <div>
            <h3 className="text-center">{isSignedIn ? "SignIn" : "Signup"} Page</h3>
            {!isSignedIn ? <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="Enter your first name" {...register("firstName", { required: true, maxLength: 20 })} />
                <input placeholder="Enter your last name" {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
                <input placeholder="Enter your age" type="number" {...register("age", { min: 18, max: 99 })} />
                {errors.age && <span className="text-error">User age should be above 18 & bleow 99</span>}
                <input type="email" placeholder="Enter your Email Address" {...register("email", { required: true })} />
                {errors.email && <span className="text-error">This field is required</span>}
                <input type="password" placeholder="Enter your Password" {...register("password", { required: true })} />
                {errors.password && <span className="text-error">This field is required</span>}
                <button className="btn btn-primary" type="submit">Signup</button>
            </form>
                : <form className="sign-in-form" onSubmit={handleSubmit(onSubmit)}>
                    <input type="email" placeholder="Enter your Email Address" {...register("email", { required: true })} />
                    {errors.email && <span className="text-error">This field is required</span>}
                    <input type="password" placeholder="Enter your Password" {...register("password", { required: true })} />
                    {errors.password && <span className="text-error">This field is required</span>}
                    <button className="btn btn-primary" type="submit">SignIn</button>
                </form>}
        </div>
    );
};

export default Login;