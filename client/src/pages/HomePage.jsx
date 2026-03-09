import Header from "../components/header/Header.jsx"
import HomeSearchBar from "../components/home/HomeSearchBar.jsx";
import HomeJobPostings from "../components/home/HomeJobPostings.jsx";

export default function HomePage() {
    return (
        <>
            <Header />
            <HomeSearchBar />
            <HomeJobPostings />
        </>
    );
}
