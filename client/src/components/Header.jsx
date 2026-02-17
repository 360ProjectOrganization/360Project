import "../styles/Header.css"

function Header() {

    return (
        <>
            <section id="header-container">
                <section id="jobly-container">
                    <a href="/">JobLy</a>
                </section>

                <section id="navigation-container">
                    <a>Company Portal</a>
                    <a>Admin Portal</a>
                </section>

                <section id="user-profile">
                    <a>Profile</a>
                </section>
            </section>
        </>
    );
};

export default Header;