import { useState } from "react";
import { Link } from "react-router-dom";

import { validateRegisterForm } from "../../utils/validation/validateRegisterForm";

export default function RegisterForm({ role }) {
    const isEmployer = role === "employer";

    const [errors, setErrors] = useState({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        
        const inputErrors = validateRegisterForm({ name, email, password, confirmPassword }, role);
        setErrors(inputErrors);

        //if errors is oempty then input is valid
        if (Object.keys(inputErrors).length > 0) {
            return;
        }
    }

    return (
        <section className="registerCard">
            <h2>You are registering as an {isEmployer ? "employer" : "applicant"}</h2>

            <form onSubmit={handleSubmit}> {/*only inputs and button */}
                <section className="nameInputSection">
                    <label>{isEmployer ? "Company Name" : "Full Name"}</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <p className="error">{errors.name}</p>}
                </section>

                <section className="emailInputSection">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p className="error">{errors.email}</p>}
                </section>

                <section className="passwordInputSection">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p className="error">{errors.password}</p>}
                </section>

                <section className="confirmPasswordInputSection">
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                </section>

                <button type="submit">Register</button>
            </form>

            <p>                
                Register as {isEmployer ? "applicant" : "employer"} <Link to={isEmployer ? "/register-applicant" : "/register-employer"}>here</Link> 
            </p>
        </section>
    );
}