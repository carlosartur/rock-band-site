import React, { useEffect, useState } from "react";
import ReCAPTCHA from 'react-google-recaptcha';
import { getAllConfigurations } from "../Utils/Utils";

const Recaptcha = ({handleCaptchaChange}) => {
    const [configurations, setConfigurations] = useState(null);

    useEffect(() => {
        getAllConfigurations()
            .then(data => setConfigurations(data));
    },[]);

    return <>
        { configurations && configurations['chave-recaptcha'] && <>
            <ReCAPTCHA
                sitekey={configurations['chave-recaptcha']['value_translated']}
                onChange={handleCaptchaChange}
                theme="dark"
                hl="pt-BR"
            />
        </>}
    </>
};

export default Recaptcha;