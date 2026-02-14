import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterForm({ role }) {
    const isEmployer = role === "employer";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        console.log({name, email, password, confirmPassword}) /*no security beacyuse idc rn */
    }

    return (
        <section className="registerCard">
            <h2>You are registering as an {isEmployer ? "employer" : "applicant"}</h2>

            <form onSubmit={handleSubmit}> {/*only inputs and button */}
                <section className="nameInputSection">
                    <label>{isEmployer ? "Company Name" : "Full Name"}</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                </section>

                <section className="emailInputSection">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </section>

                <section className="passwordInputSection">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </section>

                <section className="confirmPasswordInputSection">
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                </section>

                <button type="submit">Register</button>
            </form>

            <p>                
                Register as {isEmployer ? "applicant" : "employer"} <Link to={isEmployer ? "/register-applicant" : "/register-employer"}>here</Link> 
            </p>
        </section>
    );
}