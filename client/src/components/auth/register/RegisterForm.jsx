import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../BackButton";
import { validateRegisterForm } from "../../../utils/validation/validateRegisterForm";
import { validatePfpFile } from "../../../utils/validation/validatePfpFile";
import { authApi, setToken, setAuthUser, applicantApi, companyApi } from "../../../utils/api.js";
import { successEvent } from "../../../utils/toast/successEvent.js";

export default function RegisterForm({ typeOfUser, setOnRegisterScreen, setRegisterType }) {
    const success = successEvent("Successfully Registered");
    const navigate = useNavigate();
    const location = useLocation();
    const returnTo = location.state?.returnTo || "/";
    const openPostingId = location.state?.openPostingId || null;

    const isEmployer = typeOfUser === "Employer";

    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [pfpError, setPfpError] = useState("");
    const [pfpPostRegisterError, setPfpPostRegisterError] = useState("");
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [pfpFile, setPfpFile] = useState(null);
    const [pfpPreviewUrl, setPfpPreviewUrl] = useState(null);

    useEffect(() => {
        if (!pfpFile) {
            setPfpPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(pfpFile);
        setPfpPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [pfpFile]);

    function onPfpChange(e) {
        const input = e.target;
        const file = input.files?.[0];
        setPfpError("");
        setPfpPostRegisterError("");
        if (!file) {
            setPfpFile(null);
            return;
        }
        const check = validatePfpFile(file);
        if (!check.ok) {
            setPfpError(check.message);
            input.value = "";
            setPfpFile(null);
            return;
        }
        setPfpFile(file);
    }

    function continueAfterPfpIssue() {
        navigate(returnTo, {
            state: {
                ...(openPostingId ? { openPostingId } : {}),
            },
        });
    }
    
    const back = () => {
        setOnRegisterScreen(false);
        setRegisterType(null);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError("");
        setPfpPostRegisterError("");

        const inputErrors = validateRegisterForm({ name, email, password, confirmPassword }, typeOfUser?.toLowerCase() ?? "applicant");
        setErrors(inputErrors);

        //if errors is empty then input is valid
        if (Object.keys(inputErrors).length > 0) {
            return;
        }

        if (pfpFile) {
            const pfpCheck = validatePfpFile(pfpFile);
            if (!pfpCheck.ok) {
                setPfpError(pfpCheck.message);
                return;
            }
        }

        setLoading(true); // in case user presses Reguster button multiple times, this should prevent multiple requests
        try {
            const payload = {
                role: isEmployer ? "company" : "applicant",
                email,
                password,
                name
            };

            const response = await authApi.register(payload);
            setToken(response.token);
            setAuthUser(response.user);

            const userId = response.user?._id;
            if (pfpFile && userId) {
                try {
                    if (isEmployer) {
                        await companyApi.uploadPfp(userId, pfpFile);
                    }
                    else {
                        await applicantApi.uploadPfp(userId, pfpFile);
                    }
                }
                catch (uploadError) {
                    const msg = uploadError?.message || "Could not upload profile photo.";
                    setPfpPostRegisterError(`Account created, but your profile photo could not be uploaded: ${msg}`);
                    setLoading(false);
                    return;
                }
            }

            navigate(returnTo, {
                state: {
                    ...(openPostingId ? { openPostingId } : {}),
                },
            });
            success();
        }
        catch (err) {
            setSubmitError(err.message || "Registration failed");

        }
        finally { // doesnt matter if request fails or not
            setLoading(false);
        }
    }

    return (
        <section className="background">
            <BackButton functionToCall={back} />
            
            <section className="registerPage">
                <section className="registerCard">
                    <h2 className="roleText">JobLy {typeOfUser}</h2>

                    <form onSubmit={handleSubmit}>
                        <section className="nameInputSection">
                            <label>{isEmployer ? "Company Name" : "Full Name"}<span className="register-required"> *</span></label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={isEmployer ? "Carson versus The Computer" : "Alice Chains"} />
                            {errors.name && <p className="error">{errors.name}</p>}
                        </section>

                        <section className="emailInputSection">
                            <label>Email<span className="register-required"> *</span></label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="carson@thecomputer.com" />
                            {errors.email && <p className="error">{errors.email}</p>}
                        </section>

                        <section className="passwordInputSection">
                            <label>Password<span className="register-required"> *</span></label>
                            <div className="passwordWrapper">
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                                <button type="button" className="togglePassword" onClick={() => setShowPassword(previousSelection => !previousSelection)} aria-label={showPassword ? "Hide password" : "Show password"}>
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.password && <p className="error">{errors.password}</p>}
                        </section>

                        <section className="confirmPasswordInputSection">
                            <label>Confirm Password<span className="register-required"> *</span></label>
                            <div className="passwordWrapper">
                                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                <button type="button" className="togglePassword" onClick={() => setShowConfirmPassword(prev => !prev)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                        </section>

                        <section className="imageInputSection">
                            <label htmlFor="register-pfp-input" style={{ cursor: "pointer" }}>Choose profile photo</label>
                            <input type="file" accept="image/*" id="register-pfp-input" onChange={onPfpChange} />
                            {pfpPreviewUrl && (
                                <img src={pfpPreviewUrl} alt="Profile preview" width={140} height={140}/>
                            )}
                            {pfpError && <p className="error" role="alert">{pfpError}</p>}
                            {pfpPostRegisterError && (
                                <div className="pfp-post-register-notice">
                                    <p className="error" role="alert">{pfpPostRegisterError} You can add one from your profile later.</p>
                                    <button type="button" className="continue-after-pfp-issue" onClick={continueAfterPfpIssue}>
                                        Continue to site
                                    </button>
                                </div>
                            )}
                        </section>

                        {submitError && <p className="error">{submitError}</p>}
                        
                        <button type="submit" disabled={loading || !!pfpPostRegisterError}>{loading ? "Registering…" : "Register"}</button>
                    </form>

                    <p style={{ cursor: "pointer"}} onClick={() => {
                        setRegisterType(isEmployer ? "Applicant" : "Employer");
                    }}>
                        Not an {isEmployer ? "Employer" : "Applicant"}? Register as {isEmployer ? "Applicant" : "Employer"} instead
                    </p>
                </section>
            </section>
        </section>
    );
}
