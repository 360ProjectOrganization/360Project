import { useState } from 'react';
import BackButton from "../Login/BackButton";
import ChooseFigure from "../Login/ChooseFigure";

//images
import Applicant from "../../imgs/Applicant.png";
import Employer from "../../imgs/Employer.png";

export default function ChooseUserTypeFlow({titleText, applicantImg=Applicant, employerImg=Employer, onBack, renderNext, bottomButton, footer }) {
    const [selectedType, setSelectedType] = useState(null);
    const [onNextScreen, setOnNextScreen] = useState(false);

    const chooseType = (type) => {
        setSelectedType(type);
        setOnNextScreen(true);
    };

    return (
        <section>
            {!onNextScreen && (
                <section className="background">
                    <BackButton functionToCall={onBack} />
                    <section className="registerPage">
                        <section className="registerCard">
                            <h2>{titleText}</h2>

                            <section className = "imgContainer">
                                <ChooseFigure text = {"Applicant"} img ={applicantImg} func={() => chooseType("Applicant")}/>
                                <ChooseFigure text = {"Employer"} img ={employerImg} func={() => chooseType("Employer")}/>
                            </section>

                            {bottomButton}
                        </section>

                        {footer}
                    </section>
                </section>
            )}

            {onNextScreen && renderNext(selectedType, {setSelectedType, setOnNextScreen})}
        </section>
    );
}