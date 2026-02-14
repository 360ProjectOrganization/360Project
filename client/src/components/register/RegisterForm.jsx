import { Link } from "react-router-dom";

export default function RegisterForm({ role }) {
    const isEmployer = role === "employer";

    return (
        <section className="registerCard">
            <h2>You are registering as an {isEmployer ? "employer" : "applicant"}</h2>

            <form> {/*only inputs and button */}
                <section className="nameInputSection">
                    <label>{isEmployer ? "Company Name" : "Full Name"}</label>
                    <input type="text"/>
                </section>

                <section className="emailInputSection">
                    <label>Email</label>
                    <input type="text"/>
                </section>

                <section className="passwordInputSection">
                    <label>Password</label>
                    <input type="password"/>
                </section>

                <section className="confirmPasswordInputSection">
                    <label>Confirm Password</label>
                    <input type="password"/>
                </section>

                <button type="submit">Register</button>
            </form>

            <Link to={isEmployer ? "/register-applicant" : "/register-employer"}>
                Register as {isEmployer ? "applicant" : "employer"} here
            </Link>
        </section>
    );
}